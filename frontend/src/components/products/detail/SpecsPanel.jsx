import React from 'react';
import { Info } from 'lucide-react';
import { specLabel } from '../../../utils/specKeys';

const Row = ({ label, value }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5">
        <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">{label}</span>
        <span className="text-right text-[13px] font-medium text-foreground">{value}</span>
    </div>
);

/**
 * Bảng thông số: JSON `product.specifications` cộng thêm các cột riêng của bảng
 * (thương hiệu, mã, bảo hành, xuất xứ). Dòng trống giá trị bị loại — không hiển thị "—".
 */
const SpecsPanel = ({ product }) => {
    const rows = [
        ...Object.entries(product.specifications || {}).map(([key, value]) => ({ label: specLabel(key), value })),
        { label: 'Thương hiệu', value: product.brand?.name },
        { label: 'Mã sản phẩm', value: product.sku },
        { label: 'Bảo hành', value: product.warranty_months ? `${product.warranty_months} tháng` : 'Theo chính sách hãng' },
        { label: 'Xuất xứ', value: product.brand?.country },
    ].filter((row) => String(row.value ?? '').trim());

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-navy-50 text-navy-500">
                    <Info size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <p className="text-sm text-muted-foreground">Nhà bán chưa tải thông số kỹ thuật cho sản phẩm này.</p>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border bg-navy-50/60 px-5 py-3">
                    <h3 className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
                        {product.brand?.name || 'Chronos'} · Thông số kỹ thuật
                    </h3>
                    <p className="text-[11px] tabular-nums text-muted-foreground">{rows.length} mục theo công bố của nhà bán</p>
                </header>

                <div className="grid gap-x-10 px-5 py-1 md:grid-cols-2 md:px-8 xl:grid-cols-3">
                    {rows.map((row) => (
                        <Row key={`${row.label}-${row.value}`} label={row.label} value={row.value} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecsPanel;
