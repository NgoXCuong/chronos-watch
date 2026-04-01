import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Check, LayoutGrid, LayoutList } from 'lucide-react';
import productApi from '../../../api/product.api';
import categoryApi from '../../../api/category.api';
import brandApi from '../../../api/brand.api';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../../../utils/formatCurrency';

const ClientProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedBrand]);

    const fetchInitialData = async () => {
        try {
            const [cRes, bRes] = await Promise.all([
                categoryApi.getAll(),
                brandApi.getAll()
            ]);
            setCategories(cRes);
            setBrands(Array.isArray(bRes) ? bRes : (bRes?.rows || bRes?.data || []));
        } catch (error) {
            console.error("Lỗi lấy dữ liệu lọc:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                category_id: selectedCategory,
                brand_id: selectedBrand,
            };
            const response = await productApi.getAll(params);
            setProducts(Array.isArray(response) ? response : (response?.rows || response?.data || []));
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 transition-colors duration-500 font-sans">
            {/* Page Header */}
            <div className="bg-accent/30 py-16 border-b border-border mb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading text-foreground uppercase tracking-[0.2em] mb-4">
                        Bộ Sưu Tập Sản Phẩm
                    </h1>
                    <p className="text-muted-foreground italic font-light max-w-2xl mx-auto">
                        "Khám phá những kiệt tác thời gian đẳng cấp nhất từ các thương hiệu hàng đầu thế giới."
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-24 space-y-10">
                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Filter size={16} /> Danh Mục
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <button 
                                            onClick={() => setSelectedCategory(null)}
                                            className={cn(
                                                "text-sm transition-colors w-full text-left flex items-center justify-between",
                                                selectedCategory === null ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Tất cả
                                            {selectedCategory === null && <Check size={14} />}
                                        </button>
                                    </li>
                                    {categories.map((c) => (
                                        <li key={c.id}>
                                            <button 
                                                onClick={() => setSelectedCategory(c.id)}
                                                className={cn(
                                                    "text-sm transition-colors w-full text-left flex items-center justify-between",
                                                    selectedCategory === c.id ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {c.name}
                                                {selectedCategory === c.id && <Check size={14} />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr className="border-border" />

                            {/* Brands */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-6">Thương Hiệu</h3>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => setSelectedBrand(null)}
                                        className={cn(
                                            "text-sm transition-colors text-left flex items-center gap-2",
                                            selectedBrand === null ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn("w-3 h-3 border rounded-full flex items-center justify-center", selectedBrand === null ? "border-primary" : "border-border")}>
                                            {selectedBrand === null && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                                        </div>
                                        Tất cả
                                    </button>
                                    {brands.map((b) => (
                                        <button 
                                            key={b.id}
                                            onClick={() => setSelectedBrand(b.id)}
                                            className={cn(
                                                "text-sm transition-colors text-left flex items-center gap-2",
                                                selectedBrand === b.id ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <div className={cn("w-3 h-3 border rounded-full flex items-center justify-center", selectedBrand === b.id ? "border-primary" : "border-border")}>
                                                {selectedBrand === b.id && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                                            </div>
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
                            <p className="text-sm tracking-widest text-muted-foreground">{products.length} Mẫu đồng hồ</p>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">Chế độ xem:</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setViewMode('grid')} 
                                        className={cn("p-1.5 transition-colors", viewMode === 'grid' ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')} 
                                        className={cn("p-1.5 transition-colors", viewMode === 'list' ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        <LayoutList size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse bg-accent/30 aspect-[3/4]"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground italic">
                                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                            </div>
                        ) : (
                            /* Products */
                            <div className={cn(
                                "grid gap-8",
                                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {products.map((product) => (
                                    <Link 
                                        to={`/products/${product.slug}`} 
                                        key={product.id} 
                                        className={cn(
                                            "group block bg-background border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden",
                                            viewMode === 'list' && "flex sm:flex-row flex-col"
                                        )}
                                    >
                                        <div className={cn(
                                            "relative bg-white flex items-center justify-center p-8",
                                            viewMode === 'grid' ? "aspect-square" : "sm:w-1/3 aspect-square sm:aspect-auto"
                                        )}>
                                            <img 
                                                src={product.image_url || "https://via.placeholder.com/300?text=No+Image"} 
                                                alt={product.name} 
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className={cn(
                                            "p-6 flex flex-col justify-center",
                                            viewMode === 'grid' ? "text-center" : "sm:w-2/3 text-left"
                                        )}>
                                            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">
                                                {product.Brand?.name || 'Khác'}
                                            </p>
                                            <h3 className="text-foreground font-heading tracking-wider mb-3 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-lg text-foreground font-price tracking-wide mt-auto">
                                                {formatCurrency(product.price)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProductListPage;
