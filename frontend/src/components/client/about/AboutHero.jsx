import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import heroBanner from "../../../assets/hero-banner-sp.avif";

const Stat = ({ value, label }) => (
  <div>
    <p className="text-2xl font-bold tabular-nums text-white md:text-3xl">
      {value}
    </p>
    <p className="mt-0.5 text-[12px] uppercase tracking-[0.02em] text-navy-200">
      {label}
    </p>
  </div>
);

/**
 * Hero "Về chúng tôi": số liệu lấy thẳng từ danh mục đang chạy (không bịa số năm, số hãng),
 * ảnh nền là asset trong repo — trang cũ nhúng ảnh Unsplash nên có thể hỏng bất cứ lúc nào.
 */
const AboutHero = ({ stats, loading }) => {
  const shown = (value) => (loading ? "—" : value);

  return (
    <section className="relative overflow-hidden border-b border-border bg-navy-900">
      <img
        src={heroBanner}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-20"
      />
      <span
        className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-800/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full px-12 py-12 md:px-16 lg:px-24 lg:py-16">
        <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-300">
          Câu chuyện Chronos
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-[40px]">
          Chúng tôi bán đồng hồ chính hãng, và công khai mọi thứ đi kèm nó
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-navy-100">
          Chronos bắt đầu từ một nhóm người chơi đồng hồ cơ, mệt mỏi vì phải
          đoán già đoán non về nguồn gốc sản phẩm. Nên trang này làm theo chiều
          ngược lại: thông số đầy đủ, giá niêm yết rõ ràng, phiếu bảo hành điện
          tử tra được bằng tài khoản của bạn.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/products"
            className={buttonVariants({
              size: "sm",
              className: "h-10 gap-1.5",
            })}
          >
            Xem sản phẩm đang bán
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link
            to="/brands"
            className={buttonVariants({
              variant: "buy",
              size: "sm",
              className:
                "h-10 border-white/40 text-black hover:bg-white hover:text-navy-900",
            })}
          >
            Danh sách thương hiệu
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy-700 pt-6 sm:grid-cols-3 lg:max-w-3xl">
          <Stat value={shown(stats.brandCount)} label="Thương hiệu" />
          <Stat value={shown(stats.countryCount)} label="Quốc gia xuất xứ" />
          <Stat value={shown(stats.productCount)} label="Sản phẩm đang bán" />
        </dl>
      </div>
    </section>
  );
};

export default AboutHero;
