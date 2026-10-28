import React, { useState } from "react";
import useProductFlash from "../../../hooks/useProductFlash";
import FlashSaleBox from "../../../components/market/FlashSaleBox";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductTrustFeatures from "./ProductTrustFeatures";
import ProductDetailsTabs from "./ProductDetailsTabs";
import RelatedProducts from "./RelatedProducts";

/**
 * Phần thân trang chi tiết, mount lại theo key sản phẩm → số lượng và gallery
 * tự reset khi sang sản phẩm khác mà không cần effect nào.
 */
const ProductDetailView = ({ product, relatedProducts }) => {
  const [quantity, setQuantity] = useState(1);

  // Một nguồn giá flash cho cả khối giá và ô ưu đãi — không để hai chỗ trên
  // cùng một màn hình báo hai mức giá khác nhau.
  const { flash, msLeft } = useProductFlash(product.id);

  // Ảnh đại diện (toàn bộ mặt đồng hồ) phải đứng đầu; gallery chỉ là các góc
  // chụp chi tiết nên nếu đảo thứ tự khách sẽ mở trang bằng ảnh macro/dây.
  const galleryImages = Array.isArray(product.image_gallery) ? product.image_gallery : [];
  const images = [product.image_url, ...galleryImages]
    .filter(Boolean)
    .filter((url, index, all) => all.indexOf(url) === index);
  const discount = product.old_price
    ? Math.round((1 - Number(product.price) / Number(product.old_price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <ProductBreadcrumbs product={product} />

      <div className="mx-auto w-full px-12 py-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-14">
          <ProductGallery
            product={product}
            images={images}
            discount={discount}
          />

          <div>
            <ProductInfo product={product} flash={flash} />
            <FlashSaleBox flash={flash} msLeft={msLeft} />
            <ProductActions
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />
            <ProductTrustFeatures product={product} />
          </div>
        </div>

        <ProductDetailsTabs product={product} />
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetailView;
