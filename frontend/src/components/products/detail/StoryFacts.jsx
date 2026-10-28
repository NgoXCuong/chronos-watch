import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Package, ShieldCheck, Store } from 'lucide-react';
import { SPEC_KEYS, specLabel } from '../../../utils/specKeys';

const RANK = Object.fromEntries(SPEC_KEYS.map((item, index) => [item.key, index]));

/** Thông số có giá trị thật, ưu tiên key chuẩn, đã loại trùng nhãn (DB lẫn key Việt/Anh). */
const quickSpecs = (product) => {
    const seen = new Set();
    return Object.entries(product.specifications || {})
        .filter(([key, value]) => String(value ?? '').trim() && !seen.has(specLabel(key)) && seen.add(specLabel(key)))
        .sort(([a], [b]) => (RANK[a] ?? SPEC_KEYS.length) - (RANK[b] ?? SPEC_KEYS.length))
        .slice(0, 6)
        .map(([key, value]) => ({ label: specLabel(key), value: String(value) }));
};

const Panel = ({ icon: Icon, title, children }) => (
    <section className="rounded-xl border border-border bg-card p-4 shadow-card md:p-5">
        <h3 className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
            <Icon size={15} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            {title}
        </h3>
        {children}
    </section>
);

const Line = ({ label, value }) => (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
        <span className="shrink-0 text-[12px] uppercase tracking-[0.02em] text-muted-foreground">{label}</span>
        <span className="text-right text-[13px] font-semibold text-foreground">{value}</span>
    </div>
);

const POLICY = [
    { label: 'Vận chuyển', value: 'Miễn phí toàn quốc' },
    { label: 'Kiểm tra hàng', value: 'Trước khi nhận' },
    { label: 'Đổi trả', value: 'Trong 7 ngày' },
];

/**
 * Cột sự kiện cạnh bài "Câu chuyện": số liệu thật của sản phẩm để người đọc không
 * phải nhảy tab khi đang xem nội dung.
 */
const StoryFacts = ({ product }) => {
    const specs = quickSpecs(product);
    const brandName = product.brand?.name;

    return (
        <div className="grid grid-cols-1 gap-4 2xl:gap-5">
            <Panel icon={Store} title="Thương hiệu">
                <p className="text-[15px] font-bold text-navy-700">{brandName || 'Chronos'}</p>
                {product.brand?.country && (
                    <p className="mt-1 text-[13px] text-muted-foreground">Xuất xứ: {product.brand.country}</p>
                )}
                {product.brand_id && (
                    <Link
                        to={`/products?brand=${product.brand_id}`}
                        className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-navy-600 transition-colors hover:text-navy-700"
                    >
                        Xem tất cả sản phẩm {brandName}
                        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                    </Link>
                )}
            </Panel>

            {specs.length > 0 && (
                <Panel icon={Package} title="Thông số nhanh">
                    <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        {specs.map((spec) => (
                            <Line key={spec.label} label={spec.label} value={spec.value} />
                        ))}
                    </dl>
                </Panel>
            )}

            <Panel icon={ShieldCheck} title="Chính sách">
                <dl className="grid gap-x-8 sm:grid-cols-2">
                    <Line label="Bảo hành" value={product.warranty_months ? `${product.warranty_months} tháng` : 'Theo hãng'} />
                    {product.sku && <Line label="Mã sản phẩm" value={product.sku} />}
                    {POLICY.map((item) => (
                        <Line key={item.label} label={item.label} value={item.value} />
                    ))}
                </dl>
            </Panel>
        </div>
    );
};

export default StoryFacts;
