import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Crumb = ({ to, children, current = false }) =>
  to ? (
    <Link to={to} className="shrink-0 transition-colors hover:text-navy-700">
      {children}
    </Link>
  ) : (
    <span
      className={
        current ? "min-w-0 truncate font-semibold text-foreground" : "shrink-0"
      }
    >
      {children}
    </span>
  );

/** breadcrumb gạch ngang phẳng: Trang chủ → Sản phẩm → Hãng → tên sản phẩm. */
const ProductBreadcrumbs = ({ product }) => (
  <div className="border-b border-border bg-card">
    <div className="mx-auto w-full px-12 py-2.5 md:px-16 lg:px-24">
      <nav
        aria-label="Đường dẫn"
        className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground"
      >
        <Crumb to="/">Trang chủ</Crumb>
        <ChevronRight
          size={12}
          strokeWidth={2}
          className="shrink-0 text-navy-300"
          aria-hidden="true"
        />
        <Crumb to="/products">Sản phẩm</Crumb>
        {product?.brand?.name && (
          <>
            <ChevronRight
              size={12}
              strokeWidth={2}
              className="shrink-0 text-navy-300"
              aria-hidden="true"
            />
            <Crumb to={`/products?brand=${product.brand.id}`}>
              {product.brand.name}
            </Crumb>
          </>
        )}
        <ChevronRight
          size={12}
          strokeWidth={2}
          className="shrink-0 text-navy-300"
          aria-hidden="true"
        />
        <Crumb current>{product.name}</Crumb>
      </nav>
    </div>
  </div>
);

export default ProductBreadcrumbs;
