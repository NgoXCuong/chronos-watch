import { Flame, Timer, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatTimeLeft } from '../../utils/flashSale';
import FlashSaleCountdown from './FlashSaleCountdown';

/**
 * Khối ưu đãi Flash Sale trên trang chi tiết sản phẩm (nhận dữ liệu từ useProductFlash
 * để ô giá phía trên và khối này không bao giờ báo hai mức giá khác nhau).
 * Giá flash là GIÁ THẬT: backend tra theo đợt đang chạy lúc đặt hàng, khách không
 * chọn giá. Hết suất/đổi đợt thì khối tự ẩn sau tải lại.
 */
const FlashSaleBox = ({ flash, msLeft = 0 }) => {
    if (!flash) return null;

    const soldOut = flash.sold_out || Number(flash.remaining) <= 0;
    const limit = Number(flash.per_user_limit) || 0;
    const listPrice = Number(flash.product?.price) || Number(flash.flash_price) + Number(flash.saved || 0);

    return (
        <section className="mb-6 overflow-hidden rounded-xl border border-sale/25 bg-sale-soft/40 p-4">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide text-sale">
                    <Zap size={15} strokeWidth={2.5} aria-hidden="true" />
                    Flash Sale · {flash.sale_name}
                </span>
                {soldOut ? (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase text-muted-foreground">
                        <Flame size={13} strokeWidth={2} aria-hidden="true" /> Đã bán hết suất
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Timer size={13} strokeWidth={2} className="text-sale" aria-hidden="true" />
                        <FlashSaleCountdown msLeft={msLeft} tone="light" size="sm" />
                    </span>
                )}
            </header>

            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-2xl font-extrabold tabular-nums text-sale">{formatCurrency(flash.flash_price)}</span>
                {listPrice > Number(flash.flash_price) && (
                    <span className="text-[13px] line-through tabular-nums text-muted-foreground">
                        {formatCurrency(listPrice)}
                    </span>
                )}
                {Number(flash.discount_percent) > 0 && (
                    <span className="rounded-md bg-sale px-1.5 py-0.5 text-[11px] font-extrabold uppercase text-white">
                        -{Number(flash.discount_percent)}%
                    </span>
                )}
            </div>

            <p className="mt-2 text-[12px] font-medium tabular-nums text-navy-700 dark:text-navy-200">
                Còn {Math.max(0, Number(flash.remaining) || 0)}/{Number(flash.quota) || 0} suất flash
                {limit > 0 ? ` · giới hạn ${limit} chiếc/khách` : ' · không giới hạn mỗi khách'}
                {' · '}
                {msLeft > 0 ? `kết thúc sau ${formatTimeLeft(msLeft)}` : 'đã kết thúc'}
            </p>
        </section>
    );
};

export default FlashSaleBox;
