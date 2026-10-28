import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import productApi from '../../../api/product.api';
import { Button } from '../../../components/ui/button';
import ProductDetailView from '../../../components/products/detail/ProductDetailView';

const rowsOf = (data) => data?.rows || (Array.isArray(data) ? data : data?.data || []);

const DetailSkeleton = () => (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-xl bg-navy-50" />
        <div className="space-y-4">
            <div className="h-5 w-28 rounded bg-navy-50" />
            <div className="h-8 w-3/4 rounded bg-navy-50" />
            <div className="h-5 w-40 rounded bg-navy-50" />
            <div className="h-10 w-52 rounded bg-navy-50" />
            <div className="h-12 w-full rounded-xl bg-navy-50" />
        </div>
    </div>
);

/** Tầng dữ liệu của trang chi tiết: fetch theo slug rồi giao phần hiển thị cho ProductDetailView. */
const ProductDetailPage = () => {
    const { slug } = useParams();
    const [loadedSlug, setLoadedSlug] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            let result = null;
            try {
                const product = await productApi.getDetail(slug);
                const related = await productApi
                    .getAll({ limit: 5, brand_id: product.brand_id, exclude_id: product.id })
                    .catch(() => null);
                result = { product, related: rowsOf(related).filter((p) => (p.id ?? p._id) !== product.id) };
            } catch (error) {
                console.error('Detail Fetch Error:', error);
            }
            if (!alive) return;
            setData(result);
            setLoadedSlug(slug);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        load();
        return () => {
            alive = false;
        };
    }, [slug]);

    // Trang đang hiển thị dữ liệu của slug cũ thì coi như đang tải — khỏi setState trong effect.
    if (loadedSlug !== slug) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto w-full px-12 py-8 md:px-16 lg:px-24">
                    <DetailSkeleton />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-6 text-center">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">Không tìm thấy sản phẩm</h1>
                <p className="max-w-md text-sm text-muted-foreground">
                    Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không còn đúng.
                </p>
                <Link to="/products" className="mt-3">
                    <Button>
                        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                        Về danh sách sản phẩm
                    </Button>
                </Link>
            </div>
        );
    }

    return <ProductDetailView key={data.product.id} product={data.product} relatedProducts={data.related} />;
};

export default ProductDetailPage;
