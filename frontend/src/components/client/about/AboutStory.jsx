import React from 'react';
import classicWatch from '../../../assets/dong-ho-co.jpg';

const PRINCIPLES = [
    'Một sản phẩm — một nguồn gốc: hãng, mã, xuất xứ và thời hạn bảo hành hiển thị ngay ở trang chi tiết.',
    'Không giá ảo: giá niêm yết và giá ưu đãi tính từ dữ liệu đợt bán đang chạy, hết ưu đãi tự về mức cũ.',
    'Hậu mãi truy được: mỗi đơn giao thành công sinh một phiếu bảo hành điện tử trên tài khoản của khách.',
];

/** Đoạn đường của Chronos — ba nguyên tắc đều là tính năng đã có thật trên site, không phải lời hứa. */
const AboutStory = () => (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14">
        <figure className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-navy-50 shadow-card">
                <img src={classicWatch} alt="Đồng hồ cơ lộ máy — sản phẩm tiêu biểu của Chronos" className="aspect-[4/5] w-full object-cover" loading="lazy" />
            </div>
            <figcaption className="absolute -bottom-4 left-4 rounded-lg border border-border bg-card px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.02em] text-navy-700 shadow-card">
                Chronos · Hà Nội
            </figcaption>
        </figure>

        <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-600">Cách chúng tôi làm</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground md:text-[28px]">
                Bán hàng bằng số liệu, không bằng cảm tính
            </h2>

            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                    Chúng tôi không tự nhận mình là “đẳng cấp” hay “tuyệt tác”. Thứ duy nhất Chronos dám cam kết là những gì kiểm chứng được: đúng hãng, đúng mã, đúng thời hạn bảo hành nhà sản xuất công bố.
                </p>
                <p>
                    Phần còn lại của cửa hàng được xây để bạn tự đối chiếu — bộ lọc theo loại máy, chất liệu kính, khả năng chống nước; bảng thông số kỹ thuật cho từng mẫu; đánh giá chỉ hiện khi người mua đã nhận hàng.
                </p>
            </div>

            <ul className="mt-6 space-y-2.5">
                {PRINCIPLES.map((line) => (
                    <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-foreground/90">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy-600" aria-hidden="true" />
                        {line}
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default AboutStory;
