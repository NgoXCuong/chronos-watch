import React from 'react';
import { Ruler } from 'lucide-react';
import huongdan1 from '../../../assets/huongdan1.jpg';
import huongdan2 from '../../../assets/huongdan2.png';
import huongdan3 from '../../../assets/huongdan3.png';

const STEPS = ['Đo chu vi cổ tay', 'Xác định đường kính mặt', 'Chọn kiểu mặt số'];
const IMAGES = [huongdan1, huongdan2, huongdan3];

const SIZES = [
    { label: 'Nam', value: '38 – 42 mm' },
    { label: 'Nữ', value: '26 – 34 mm' },
    { label: 'Cổ tay 15 – 17 cm', value: 'Dây điều chỉnh' },
];

/** Hướng dẫn chọn cỡ dùng ảnh tĩnh đã upload vào repo — không bịa số đo theo từng sản phẩm. */
const SizeGuidePanel = () => (
    <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 xl:grid-cols-4">
        {IMAGES.map((img, index) => (
            <figure key={index} className="overflow-hidden rounded-xl border border-border bg-navy-50 p-2 shadow-card">
                <img src={img} alt={`Hướng dẫn chọn cỡ tay — bước ${index + 1}`} loading="lazy" className="h-auto w-full rounded-lg bg-card object-contain" />
                <figcaption className="px-1 py-2.5 text-center">
                    <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">Bước {index + 1}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{STEPS[index]}</p>
                </figcaption>
            </figure>
        ))}

        <aside className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
                <Ruler size={15} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
                Cỡ phổ biến
            </h3>
            <dl className="space-y-0.5">
                {SIZES.map((item) => (
                    <div key={item.label} className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
                        <dt className="text-[12px] text-muted-foreground">{item.label}</dt>
                        <dd className="text-right text-[13px] font-semibold tabular-nums text-foreground">{item.value}</dd>
                    </div>
                ))}
            </dl>
            <p className="mt-auto pt-4 text-xs leading-relaxed text-muted-foreground">
                Còn phân vân giữa hai cỡ? Gọi hotline để được tư vấn trước khi đặt.
            </p>
            <a href="tel:1900888866" className="mt-1 text-[13px] font-bold text-navy-600 transition-colors hover:text-navy-700">
                Hotline 1900 8888 66
            </a>
        </aside>
    </div>
);

export default SizeGuidePanel;
