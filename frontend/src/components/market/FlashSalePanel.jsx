import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import useFlashSale from '../../hooks/useFlashSale';
import { formatTimeLeft } from '../../utils/flashSale';
import FlashSaleCountdown from './FlashSaleCountdown';
import FlashProductCard from './FlashProductCard';

const SKELETON = [0, 1, 2, 3];

/**
 * Panel Flash Sale trang chủ: đọc đúng đợt ĐANG CHẠY từ /flash-sales/current
 * (trước đây panel này bịa: lấy 4 sản phẩm mới nhất và đếm ngược về nửa đêm).
 * Đồng hồ theo server_time, suất bán/ còn lại là số thật từ đơn hàng.
 */
const FlashSalePanel = () => {
    const { loading, state, sale, items, upcoming, endsInMs, startsInMs } = useFlashSale();

    if (!loading && !sale && !upcoming) return null;

    const visible = (items || []).slice(0, 4);

    return (
        <section id="flash-sale" className="scroll-mt-28 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="flex flex-col lg:flex-row">
                <div className="flex shrink-0 flex-col justify-center gap-4 bg-linear-to-br from-navy-950 via-navy-900 to-navy-800 p-6 lg:w-[260px]">
                    <div className="flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white">
                            <Zap size={18} strokeWidth={2} aria-hidden="true" />
                        </span>
                        <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">Flash Sale</h2>
                    </div>

                    {sale ? (
                        <div>
                            <p className="mb-1.5 text-[11px] font-semibold uppercase text-navy-100">
                                {state === 'sold_out' ? 'Suất đã bán hết' : state === 'expired' ? 'Đã kết thúc' : 'Kết thúc trong'}
                            </p>
                            <FlashSaleCountdown msLeft={endsInMs} />
                            <p className="mt-2 text-[11px] text-navy-200">{sale.name}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-1.5 text-[11px] font-semibold uppercase text-navy-100">Đợt tiếp theo</p>
                            <p className="text-sm font-bold text-white">
                                {upcoming?.name}
                            </p>
                            <p className="mt-1 text-xs tabular-nums text-navy-200">
                                bắt đầu sau {formatTimeLeft(startsInMs)}
                            </p>
                        </div>
                    )}

                    <Link
                        to="/products?sort=discount"
                        className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-white bg-white px-4 text-xs font-semibold uppercase text-navy-800 transition-colors hover:border-navy-600 hover:bg-navy-600 hover:text-white"
                    >
                        Xem ưu đãi
                    </Link>
                </div>

                <div className="min-w-0 flex-1 p-4">
                    {loading ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {SKELETON.map((key) => (
                                <div key={key} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
                                    <div className="aspect-square bg-navy-100" />
                                    <div className="space-y-2 p-3">
                                        <div className="h-3 w-3/4 rounded bg-navy-100" />
                                        <div className="h-4 w-1/2 rounded bg-navy-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : visible.length === 0 ? (
                        <p className="flex min-h-40 items-center justify-center px-6 text-center text-[13px] text-muted-foreground">
                            Đang chờ mở bán suất Flash — các ưu đãi thường vẫn còn ở mục Xem ưu đãi.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {visible.map((item) => (
                                <FlashProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FlashSalePanel;
