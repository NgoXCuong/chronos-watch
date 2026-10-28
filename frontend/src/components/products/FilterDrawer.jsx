import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

/**
 * Drawer bộ lọc cho mobile. Chưa có primitive sheet trong dự án nên giữ layout tay
 * (backdrop + panel trượt trái→phải) giống các drawer chọn dòng ở trang Thành viên.
 */
const FilterDrawer = ({ open, onClose, title = 'Bộ lọc', resultCount, children }) => {
    useEffect(() => {
        if (!open) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    return (
        <div className={cn('fixed inset-0 z-150 lg:hidden', !open && 'pointer-events-none')} aria-hidden={!open}>
            <div
                onClick={onClose}
                className={cn('absolute inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
                aria-hidden="true"
            />
            <div
                className={cn(
                    'absolute inset-y-0 right-0 flex w-[min(360px,90vw)] flex-col bg-card shadow-hover transition-transform duration-300',
                    open ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Đóng bộ lọc" className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-navy-50 hover:text-navy-700">
                        <X size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

                <div className="border-t border-border p-3">
                    <Button onClick={onClose} className="w-full">
                        Xem {resultCount} sản phẩm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterDrawer;
