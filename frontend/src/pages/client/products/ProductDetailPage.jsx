import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import productApi from '../../../api/product.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../../hooks/useAuth';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProductDetail();
    }, [slug]);

    const fetchProductDetail = async () => {
        setLoading(true);
        try {
            const data = await productApi.getDetail(slug);
            setProduct(data);
        } catch (error) {
            console.error("Lỗi lấy chi tiết sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // TODO: Implement Add to Cart logic
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-16 flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl font-heading text-destructive mb-4">404</h2>
                <p className="text-muted-foreground uppercase tracking-widest mb-8">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
                <Link to="/products" className="text-primary hover:underline uppercase tracking-widest text-sm">Quay lại Cửa Hàng</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-24 transition-colors duration-500 font-sans">
            <div className="container mx-auto px-6">
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-12">
                    <Link to="/" className="hover:text-foreground transition-colors">Trang Chủ</Link>
                    <ChevronRight size={12} />
                    <Link to="/products" className="hover:text-foreground transition-colors">Đồng Hồ</Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <div className="bg-white border border-border/50 aspect-square flex items-center justify-center p-12 hover:shadow-2xl transition-shadow duration-700">
                            <img 
                                src={product.image_url || "https://via.placeholder.com/600?text=No+Image"} 
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <p className="text-sm text-primary font-bold tracking-[0.3em] uppercase mb-4">
                            {product.Brand?.name || 'Thương Hiệu Riêng'}
                        </p>
                        <h1 className="text-3xl md:text-5xl font-heading text-foreground tracking-wider leading-tight mb-6">
                            {product.name}
                        </h1>

                        <div className="text-3xl text-foreground font-price tracking-wide mb-8">
                            {formatCurrency(product.price)}
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground font-light leading-relaxed mb-10">
                            {product.description ? (
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            ) : (
                                <p className="italic">Chưa có mô tả chi tiết cho sản phẩm này.</p>
                            )}
                        </div>

                        <hr className="border-border my-8" />

                        {/* Actions */}
                        <div className="flex items-end gap-6 mb-12">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Số lượng</label>
                                <div className="flex items-center border border-border">
                                    <button 
                                        className="px-4 py-3 text-foreground hover:bg-accent transition-colors"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >-</button>
                                    <span className="px-6 py-3 text-foreground font-medium min-w-[3rem] text-center">{quantity}</span>
                                    <button 
                                        className="px-4 py-3 text-foreground hover:bg-accent transition-colors"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >+</button>
                                </div>
                            </div>

                            <Button 
                                onClick={handleAddToCart}
                                className="flex-1 py-7 uppercase tracking-[0.2em] font-bold bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none transition-all duration-500"
                            >
                                Thêm Vào Giỏ <ShoppingBag size={18} className="ml-2" />
                            </Button>

                            <button className="p-4 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                <Heart size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Guaranty & Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                            <div className="flex flex-col gap-3 items-start">
                                <ShieldCheck size={28} className="text-primary" strokeWidth={1} />
                                <span className="text-xs uppercase tracking-widest text-foreground font-semibold">Bảo Hành 5 Năm</span>
                                <p className="text-[10px] text-muted-foreground">Chính hãng quốc tế</p>
                            </div>
                            <div className="flex flex-col gap-3 items-start">
                                <Truck size={28} className="text-primary" strokeWidth={1} />
                                <span className="text-xs uppercase tracking-widest text-foreground font-semibold">Giao Hàng Miễn Phí</span>
                                <p className="text-[10px] text-muted-foreground">Toàn quốc an toàn tuyệt đối</p>
                            </div>
                            <div className="flex flex-col gap-3 items-start">
                                <RotateCcw size={28} className="text-primary" strokeWidth={1} />
                                <span className="text-xs uppercase tracking-widest text-foreground font-semibold">Đổi Trả Dễ Dàng</span>
                                <p className="text-[10px] text-muted-foreground">Trong vòng 14 ngày</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
