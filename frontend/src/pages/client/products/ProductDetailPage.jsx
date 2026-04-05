import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';

import { useTheme } from '../../../context/ThemeContext';
import productApi from '../../../api/product.api';

// New Modular Components
import ProductBreadcrumbs from '../../../components/products/detail/ProductBreadcrumbs';
import ProductGallery from '../../../components/products/detail/ProductGallery';
import ProductInfo from '../../../components/products/detail/ProductInfo';
import ProductActions from '../../../components/products/detail/ProductActions';
import ProductTrustFeatures from '../../../components/products/detail/ProductTrustFeatures';
import ProductDetailsTabs from '../../../components/products/detail/ProductDetailsTabs';
import ProductEditorial from '../../../components/products/detail/ProductEditorial';
import RelatedProducts from '../../../components/products/detail/RelatedProducts';

import { Button } from '../../../components/ui/button';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setLoading(true);
        productApi.getDetail(slug)
            .then(data => {
                setProduct(data);
                // Fetch related products
                productApi.getAll({
                    limit: 4,
                    brand_id: data.brand_id,
                    exclude_id: data.id
                }).then(relData => {
                    const items = relData?.rows || (Array.isArray(relData) ? relData : (relData?.data || []));
                    setRelatedProducts(items.filter(p => (p.id || p._id) !== data.id));
                });
            })
            .catch(err => console.error("Detail Fetch Error:", err))
            .finally(() => {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    }, [slug]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-amber-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="mt-4 text-[10px] uppercase text-amber-500 font-bold text-center">Chronos</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
                <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: 'Cinzel, serif' }}>Tuyệt phẩm không tìm thấy</h2>
                <p className={`mb-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Hiện tại chúng tôi không tìm thấy sản phẩm bạn yêu cầu.</p>
                <Link to="/products">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-none px-8 py-6 uppercase text-[10px]">
                        Khám phá bộ sưu tập
                    </Button>
                </Link>
            </div>
        );
    }

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    const images = product.image_gallery && product.image_gallery.length > 0 ? product.image_gallery : [product.image_url];
    const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null;

    // Stock Status
    const getStockStatus = () => {
        if (product.stock <= 0) return { label: 'Hết hàng', color: 'text-red-500', icon: <Clock className="w-4 h-4" /> };
        if (product.stock <= 5) return { label: 'Chỉ còn ' + product.stock + ' chiếc', color: 'text-orange-500', icon: <Clock className="w-4 h-4" /> };
        return { label: 'Còn hàng', color: 'text-emerald-500', icon: <CheckCircle2 className="w-4 h-4" /> };
    };
    const stockStatus = getStockStatus();

    return (
        <div className={`min-h-screen transition-colors duration-500 pb-20 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            <ProductBreadcrumbs product={product} isDark={isDark} />

            <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    <ProductGallery 
                        product={product} 
                        images={images} 
                        discount={discount} 
                        isDark={isDark} 
                        thumbsSwiper={thumbsSwiper}
                        setThumbsSwiper={setThumbsSwiper}
                    />

                    <div className="flex flex-col pt-2">
                        <ProductInfo 
                            product={product} 
                            stockStatus={stockStatus} 
                            isDark={isDark} 
                            formatCurrency={formatCurrency} 
                        />
                        
                        <ProductActions 
                            product={product} 
                            quantity={quantity} 
                            setQuantity={setQuantity} 
                            isDark={isDark} 
                        />

                        <ProductTrustFeatures isDark={isDark} />
                    </div>
                </div>

                <ProductDetailsTabs product={product} isDark={isDark} />

                <ProductEditorial product={product} isDark={isDark} />

                <RelatedProducts relatedProducts={relatedProducts} isDark={isDark} />
            </div>

            <style>{`
                /* Global Swiper Thumb Overlay Style - kept for synchronization */
                .thumbs-swiper-luxury .swiper-slide-thumb-active {
                    border-color: #d97706 !important;
                }
                .thumbs-swiper-luxury .swiper-slide-thumb-active img {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default ProductDetailPage;
