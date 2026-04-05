/**
 * sanitizeQuillHtml
 *
 * Làm sạch HTML output từ Quill editor trước khi render ở phía client.
 *
 * Vấn đề Quill gây ra:
 *  1. Inject color/background-color inline vào <span> → hỏng dark mode
 *  2. Dùng &nbsp; thay vì space → text không wrap tự nhiên
 *  3. Inject font-family inline → override design system font
 *  4. Wrap text trong <span> rỗng không cần thiết → noise trong DOM
 */
export function sanitizeQuillHtml(html) {
    if (!html || typeof html !== 'string') return '';

    // Dùng DOMParser để xử lý HTML an toàn
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Bước 1: Strip tất cả inline style nguy hiểm từ MỌI element
    doc.querySelectorAll('[style]').forEach(el => {
        const style = el.style;

        // Xóa color overrides (để CSS .prose-editorial kiểm soát)
        style.removeProperty('color');
        style.removeProperty('background-color');
        style.removeProperty('background');

        // Xóa font-family overrides
        style.removeProperty('font-family');

        // Xóa font-size inline (dùng class ql-size-* thay thế)
        // style.removeProperty('font-size'); // giữ lại nếu muốn

        // Nếu style attribute rỗng sau khi xóa → xóa luôn attribute
        const remaining = el.getAttribute('style');
        if (!remaining || !remaining.trim()) {
            el.removeAttribute('style');
        }
    });

    // Bước 2: Unwrap các <span> không còn attributes (pure noise)
    // Làm nhiều lần vì có thể lồng nhau
    let hasEmptySpans = true;
    let iterations = 0;
    while (hasEmptySpans && iterations < 5) {
        hasEmptySpans = false;
        iterations++;
        doc.querySelectorAll('span:not([class]):not([style]):not([id]):not([data-value])').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
                hasEmptySpans = true;
            }
        });
    }

    // Bước 3: Thay &nbsp; (U+00A0) bằng space thường trong text nodes
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }
    textNodes.forEach(tn => {
        // Non-breaking space → normal space
        tn.textContent = tn.textContent.replace(/\u00a0/g, ' ');
    });

    // Bước 4: Xóa <p> rỗng hoặc chỉ có khoảng trắng ở cuối
    doc.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim() && !p.querySelector('img, br, iframe')) {
            // Chỉ xóa nếu không chứa media
            if (p.innerHTML.trim() === '' || p.innerHTML.trim() === '<br>') {
                p.remove();
            }
        }
    });

    return doc.body.innerHTML;
}
