import React from 'react';
import { countdownParts, formatTimeLeft, padTwo } from '../../utils/flashSale';

const TONE = {
    dark: { cell: 'bg-white/10 text-white', sep: 'text-navy-300' },
    light: { cell: 'bg-navy-100 text-navy-800', sep: 'text-navy-300' },
};

/**
 * Nhà đếm Flash Sale. `msLeft` luôn tính từ server_time (hooks/useFlashSale) —
 * đồng hồ máy khách có thể sai giờ, còn hạn đợt thì không.
 * Quá 48 giờ thì nói bằng ngày/giờ, dồn hết vào HH:MM:SS chỉ tổ khó đọc.
 */
export const FlashSaleCountdown = ({ msLeft, tone = 'dark', size = 'lg', className = '' }) => {
    const parts = countdownParts(msLeft);
    const palette = TONE[tone] ?? TONE.dark;

    if (parts.total <= 0) {
        return <span className="text-[11px] font-semibold uppercase text-navy-200">Đã kết thúc</span>;
    }
    if (parts.days >= 2) {
        return <span className="text-sm font-bold tabular-nums text-white">còn {formatTimeLeft(parts.total)}</span>;
    }

    const cells = [
        { label: 'GIỜ', value: parts.hours + parts.days * 24 },
        { label: 'PHÚT', value: parts.minutes },
        { label: 'GIÂY', value: parts.seconds },
    ];
    const box = size === 'sm' ? 'px-1.5 py-0.5 text-base' : 'px-2 py-1 text-lg';

    return (
        <div className={`flex items-end gap-1.5 ${className}`} role="timer" aria-label={`Còn lại ${formatTimeLeft(parts.total)}`}>
            {cells.map((cell, i) => (
                <React.Fragment key={cell.label}>
                    {i > 0 && <span className={`pb-4 text-lg font-bold ${palette.sep}`}>:</span>}
                    <div className="flex flex-col items-center gap-1">
                        <span className={`rounded-md font-mono font-extrabold tabular-nums ${palette.cell} ${box}`}>
                            {padTwo(cell.value)}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-[0.02em] ${tone === 'dark' ? 'text-navy-200' : 'text-muted-foreground'}`}>
                            {cell.label}
                        </span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default FlashSaleCountdown;
