import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../market/ProductCard';

/** Gợi ý cùng hãng — dùng đúng thẻ sản phẩm chuẩn thị trường, không có bản "luxury" riêng. */
const RelatedProducts = ({ relatedProducts }) => {
    if (relatedProducts.length === 0) return null;

    return (
        <section className="mt-12 border-t border-border pt-8">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-foreground md:text-xl">Sản phẩm cùng thương hiệu</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Thêm lựa chọn để so sánh giá và thông số.</p>
                </div>
                <Link to="/products" className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-navy-600 transition-colors hover:text-navy-700">
                    Xem tất cả
                    <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id ?? product._id} product={product} compact />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
