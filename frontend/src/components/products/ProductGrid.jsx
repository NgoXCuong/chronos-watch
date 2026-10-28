import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../ui/button';
import ProductCard from '../market/ProductCard';

const SkeletonCard = () => (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="animate-pulse bg-navy-100" style={{ aspectRatio: '1' }} />
        <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-navy-100" />
            <div className="h-4 w-full animate-pulse rounded bg-navy-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-navy-100" />
        </div>
    </div>
);

/** Lưới sản phẩm + 2 trạng thái (đang tải / rỗng) để trang chỉ lo bộ lọc và phân trang. */
const ProductGrid = ({ products, loading, onClearFilters }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
                <SearchX size={40} strokeWidth={1.5} className="mb-4 text-navy-300" aria-hidden="true" />
                <h3 className="text-lg font-bold text-foreground">Không tìm thấy sản phẩm nào</h3>
                <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                    Bộ lọc hiện tại quá chặt. Thử bỏ bớt điều kiện hoặc xem toàn bộ danh mục.
                </p>
                <Button onClick={onClearFilters} className="mt-6">
                    Xóa tất cả bộ lọc
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id ?? product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
