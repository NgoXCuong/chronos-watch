import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import watchImage from "../../assets/hero-banner-sp.avif";

export default function CatalogIntro({ title, totalCount, loading, categories, categoryId, onCategoryChange }) {
  return <header className="catalog-intro">
    <nav aria-label="Đường dẫn" className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">Trang chủ</Link><ChevronRight size={12} /><span aria-current="page">Sản phẩm</span></nav>
    <div className="catalog-intro-panel">
      <div className="catalog-intro-copy">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">The Chronos collection</p>
        <h1>{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Khám phá những thiết kế dành cho phong cách của bạn. Chọn thương hiệu, bộ máy và mức giá để tìm chiếc đồng hồ phù hợp.</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-primary"><ShieldCheck size={15} />Đồng hồ chính hãng</span>
          <span className="text-muted-foreground">{loading ? "Đang cập nhật kết quả…" : <><strong className="font-semibold tabular-nums text-foreground">{totalCount}</strong> sản phẩm phù hợp</>}</span>
        </div>
      </div>
      <div className="catalog-intro-photo"><img src={watchImage} alt="Chi tiết mặt số xanh và dây thép của đồng hồ" /><Link to="/brands" className="catalog-photo-link">Khám phá thương hiệu <ArrowUpRight size={14} /></Link></div>
    </div>
    <div className="catalog-category-links" aria-label="Chọn nhanh danh mục">
      <button onClick={() => onCategoryChange({ categoryId: "", categoryLabel: "" })} aria-pressed={!categoryId} className={cn("catalog-category-link", !categoryId && "active")}>Tất cả đồng hồ</button>
      {categories.slice(0, 6).map((category) => <button key={category.id} onClick={() => onCategoryChange({ categoryId: String(category.id), categoryLabel: category.name })} aria-pressed={String(category.id) === categoryId} className={cn("catalog-category-link", String(category.id) === categoryId && "active")}>{category.name}</button>)}
    </div>
  </header>;
}
