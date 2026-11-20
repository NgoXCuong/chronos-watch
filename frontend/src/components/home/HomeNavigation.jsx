import "../../styles/flash-sale-storefront.css";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import HomeNavDropdown from "./HomeNavDropdown";
import { useCategories } from "../../hooks/useCategories";
import brandApi from "../../api/brand.api";
import { NAV_LINKS } from "../../constants/navigation";

const PRICE_ITEMS = [
  { label: "Dưới 2 triệu", to: "/products?max_price=2000000" },
  { label: "Từ 2 đến 5 triệu", to: "/products?min_price=2000000&max_price=5000000" },
  { label: "Từ 5 đến 10 triệu", to: "/products?min_price=5000000&max_price=10000000" },
  { label: "Trên 10 triệu", to: "/products?min_price=10000000" },
];
export default function HomeNavigation() {
  const { pathname } = useLocation();
  const { categories, loading } = useCategories();
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    let alive = true;
    brandApi.getAll({ limit: 8, sort: "product_count", dir: "desc" }).then((data) => {
      if (alive) setBrands(data?.rows || (Array.isArray(data) ? data : []));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const groups = [
    { title: "Danh mục", items: categories.map((c) => ({ label: c.name, to: `/products?category=${c.slug || c.id}` })) },
    { title: "Thương hiệu", items: brands.map((brand) => ({ label: brand.name, to: `/products?brand=${brand.id}` })) },
    { title: "Khoảng giá", items: PRICE_ITEMS },
    { title: "Loại máy", items: [
      { label: "Máy cơ tự động", to: "/products?movement=Automatic" },
      { label: "Máy pin / Quartz", to: "/products?movement=Quartz" },
    ] },
  ];
  return <nav aria-label="Điều hướng chính" className="storefront-navigation">
    {NAV_LINKS.map((link) => link.to === "/products" ? (
      <div key={link.to} className="storefront-product-menu">
        <HomeNavDropdown label="Sản phẩm" to="/products" groups={groups} loading={loading} active={pathname.startsWith("/products")} columns={2} />
      </div>
    ) : link.anchor ? (
      <Link key={link.to} to={link.to} className="storefront-nav-item">{link.label}<span className="rounded bg-sale px-1 py-0.5 text-[9px] font-bold leading-none text-white">HOT</span></Link>
    ) : <NavLink key={link.to} to={link.to} end={link.end} className={({isActive}) => cn("storefront-nav-item", isActive && "active")}>{link.label}</NavLink>)}
  </nav>;
}
