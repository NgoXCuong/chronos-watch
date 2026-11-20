// Tự phục hồi một lần khi browser giữ chunk cũ; chặn vòng lặp nếu lỗi kéo dài.
export function installChunkRecovery() {
    window.addEventListener('vite:preloadError', (event) => {
        const message = String(event.payload?.message || event.payload || '');
        if (!/Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk .* failed/i.test(message)) return;
        try {
            const now = Date.now();
            const previous = Number(sessionStorage.getItem('chronos_chunk_reload') || 0);
            if (now - previous < 60000) return;
            sessionStorage.setItem('chronos_chunk_reload', String(now));
            event.preventDefault();
            window.location.reload();
        } catch { /* Storage bị chặn: để ErrorBoundary hiển thị nút tải lại. */ }
    });
}
