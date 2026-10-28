import React from 'react';
import { sanitizeQuillHtml } from '../../../utils/sanitizeQuill';
import StoryFacts from './StoryFacts';

const FALLBACK =
    '<p>Câu chuyện về sản phẩm này đang được chúng tôi hoàn thiện. Mọi thông số đã công bố ở tab “Thông số kỹ thuật” vẫn đầy đủ và có thể dùng để so sánh.</p>';

/**
 * Tab "Câu chuyện": HTML mô tả do admin soạn bằng Quill. Kiểu đọc nằm ở
 * styles/prose-editorial.css (HTML chèn qua dangerouslySetInnerHTML không ăn class Tailwind).
 * Quill hay để lại toàn thẻ rỗng (`<p></p>`) nên phải làm sạch rồi mới kiểm tra còn nội dung không.
 */
const ProductEditorial = ({ product }) => {
    const body = sanitizeQuillHtml(product.description) || FALLBACK;

    return (
        <div className="grid grid-cols-1 items-start gap-5 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)] 2xl:grid-cols-[minmax(0,780px)_minmax(0,1fr)] 2xl:gap-6">
            <article className="relative overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-navy-600 via-navy-300 to-transparent" aria-hidden="true" />

                <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 md:px-8">
                    <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
                        {product.brand?.name || 'Chronos'} · Giới thiệu sản phẩm
                    </p>
                    {product.sku && <p className="hidden text-[11px] tabular-nums text-muted-foreground sm:block">SKU {product.sku}</p>}
                </header>

                <div className="prose-editorial px-5 py-6 md:px-8 md:py-8" dangerouslySetInnerHTML={{ __html: body }} />
            </article>

            <StoryFacts product={product} />
        </div>
    );
};

export default ProductEditorial;
