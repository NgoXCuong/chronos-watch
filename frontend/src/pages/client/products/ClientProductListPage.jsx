import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, LayoutGrid, List as ListIcon, Search, ShieldCheck, Banknote } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import productApi from '../../../api/product.api';
import categoryApi from '../../../api/category.api';
import brandApi from '../../../api/brand.api';
import ProductCard from '../../../components/ui/ProductCard';

const ClientProductListPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [searchParams, setSearchParams] = useSearchParams();

    // UI States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);

    // Current Filters from URL
    const currentCategory = searchParams.get('category') || '';
    const currentBrand = searchParams.get('brand') || '';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentSearch = searchParams.get('search') || '';
    const currentMinPrice = searchParams.get('min_price') || '';
    const currentMaxPrice = searchParams.get('max_price') || '';

    useEffect(() => {
        // Fetch Filter Options
        Promise.all([
            categoryApi.getAll(),
            brandApi.getAll()
        ]).then(([catData, brandData]) => {
            setCategories(Array.isArray(catData) ? catData : (catData?.data || []));
            setBrands(Array.isArray(brandData) ? brandData : (brandData?.data || []));
        }).catch(err => console.error("Filter Fetch Error:", err));
    }, []);

    useEffect(() => {
        setLoading(true);
        // Build API params
        const params = {
            limit: 12,
            category_id: currentCategory,
            brand_id: currentBrand,
            sort: currentSort,
            search: currentSearch,
            min_price: currentMinPrice,
            max_price: currentMaxPrice
        };

        productApi.getAll(params)
            .then(data => {
                const items = data?.rows || (Array.isArray(data) ? data : (data?.data || []));
                setProducts(items);
                setTotalProducts(data?.count || items.length);
            })
            .catch(err => {
                console.error("Product Fetch Error:", err);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    }, [currentCategory, currentBrand, currentSort, currentSearch, currentMinPrice, currentMaxPrice]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            {/* Page Header */}
            <div className="relative h-[350px] md:h-[450px] flex items-center overflow-hidden border-b dark:border-white/5">
                {/* Ảnh nền */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2000&auto=format&fit=crop"
                        alt="Chronos Banner"
                        className="w-full h-full object-cover"
                    />
                    {/* Lớp phủ Gradient để làm nổi bật chữ */}
                    <div className={`absolute inset-0 z-10 ${isDark
                        ? 'bg-gradient-to-r from-black via-black/80 to-transparent'
                        : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`}
                    ></div>
                </div>

                {/* Nội dung Text */}
                <div className="relative z-20 max-w-[1400px] mx-auto px-6 w-full">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4 animate-fade-in">
                            <span className="text-[10px] md:text-xs uppercase  text-amber-500 font-bold">Chronos Elite</span>
                            <div className="w-12 h-[1px] bg-amber-500/50"></div>
                        </div>
                        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                            Toàn Bộ <br /> Sản Phẩm
                        </h1>
                        <p className={`text-sm md:text-lg max-w-lg mb-8 leading-relaxed ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}>
                            Khám phá tinh hoa chế tác đồng hồ từ những thương hiệu hàng đầu thế giới. Mỗi chiếc đồng hồ là một bản giao hưởng của thời gian.
                        </p>
                        <div className={`inline-flex items-center gap-4 px-5 py-2.5 rounded-full border backdrop-blur-md text-[10px] md:text-xs uppercase  font-bold ${isDark ? 'border-white/10 text-zinc-300 bg-white/5' : 'border-zinc-200 text-zinc-600 bg-white/50'}`}>
                            <span className="text-amber-500">{totalProducts}</span> Tuyệt phẩm thời gian
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-32 space-y-6">
                            {/* Categories */}
                            <div className={`pb-4 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                        <LayoutGrid className="w-4 h-4" />
                                    </div>
                                    <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Danh Mục</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => updateFilter('category', '')}
                                        className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                            ${!currentCategory
                                                ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => updateFilter('category', cat.id)}
                                            className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                                ${currentCategory == cat.id
                                                    ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                    : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                                }`}
                                            title={cat.name}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            <div className={`pb-4 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Thương Hiệu</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => updateFilter('brand', '')}
                                        className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                            ${!currentBrand
                                                ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                    {brands.map(brand => (
                                        <button
                                            key={brand.id}
                                            onClick={() => updateFilter('brand', brand.id)}
                                            className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                                ${currentBrand == brand.id
                                                    ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                    : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                                }`}
                                            title={brand.name}
                                        >
                                            {brand.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Tiers */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                        <Banknote className="w-4 h-4" />
                                    </div>
                                    <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Khoảng Giá</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { label: 'Tất cả giá', min: '', max: '' },
                                        { label: 'Dưới 10 triệu', min: '0', max: '10000000' },
                                        { label: '10 - 50 triệu', min: '10000000', max: '50000000' },
                                        { label: '50 - 200 triệu', min: '50000000', max: '200000000' },
                                        { label: 'Trên 200 triệu', min: '200000000', max: '' },
                                    ].map((tier, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                if (tier.min) newParams.set('min_price', tier.min); else newParams.delete('min_price');
                                                if (tier.max) newParams.set('max_price', tier.max); else newParams.delete('max_price');
                                                setSearchParams(newParams);
                                            }}
                                            className={`px-4 py-2 text-left text-xs transition-all duration-300 rounded-md border
                                                ${currentMinPrice === tier.min && currentMaxPrice === tier.max
                                                    ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                    : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                                }`}
                                        >
                                            {tier.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        {/* Control Bar */}
                        <div className={`flex items-center justify-between mb-10 pb-6 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className={`lg:hidden flex items-center gap-2 text-[10px] uppercase font-bold px-4 py-2 border ${isDark ? 'border-white/10 text-white' : 'border-zinc-100 text-zinc-900'}`}
                                >
                                    <Filter className="w-3 h-3" /> Bộ lọc
                                </button>

                                <div className="hidden sm:flex items-center gap-2 p-1 border rounded-sm dark:border-white/5">
                                    <button className={`p-1.5 ${isDark ? 'text-white bg-white/5' : 'text-zinc-900 bg-zinc-100'}`}><LayoutGrid className="w-4 h-4" /></button>
                                    <button className={`p-1.5 ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}><ListIcon className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className={`hidden md:inline text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}>Sắp xếp theo</span>
                                <select
                                    value={currentSort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                    className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${isDark ? 'text-white' : 'text-zinc-900'}`}
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price_asc">Giá: Thấp đến Cao</option>
                                    <option value="price_desc">Giá: Cao đến Thấp</option>
                                    <option value="popular">Phổ biến nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Tags / Active Filters */}
                        {(currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentSearch) && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {currentCategory && <span className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold border border-amber-500/20">Danh mục: {categories.find(c => c.id == currentCategory)?.name} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', '')} /></span>}
                                {currentBrand && <span className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold border border-amber-500/20">Hãng: {brands.find(b => b.id == currentBrand)?.name} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('brand', '')} /></span>}
                                {(currentMinPrice || currentMaxPrice) && <span className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold border border-amber-500/20">Lọc giá <X className="w-3 h-3 cursor-pointer" onClick={() => { updateFilter('min_price', ''); updateFilter('max_price', ''); }} /></span>}
                                <button onClick={clearFilters} className={`text-[10px] uppercase font-bold underline transition-colors ${isDark ? 'text-zinc-700 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>Xóa tất cả</button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`aspect-[3/4] ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id || product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center">
                                <Search className={`w-12 h-12 mx-auto mb-6 opacity-20 ${isDark ? 'text-white' : 'text-zinc-900'}`} />
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Không tìm thấy sản phẩm nào</h3>
                                <p className={`text-sm ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
                                <button onClick={clearFilters} className="mt-8 px-8 py-3 bg-amber-600 text-white text-[11px] uppercase font-bold hover:bg-amber-700 transition-colors">Quay lại tất cả</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <div className={`fixed inset-0 z-[100] transition-transform duration-500 lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-80 p-8 flex flex-col shadow-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Bộ lọc</h2>
                        <X className={`w-6 h-6 cursor-pointer ${isDark ? 'text-white' : 'text-zinc-900'}`} onClick={() => setIsFilterOpen(false)} />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-12 pb-10 pr-2">
                        {/* Categories */}
                        <div className={`pb-8 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                    <LayoutGrid className="w-4 h-4" />
                                </div>
                                <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Danh Mục</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => updateFilter('category', '')}
                                    className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                        ${!currentCategory
                                            ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                            : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                        }`}
                                >
                                    Tất cả
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateFilter('category', cat.id)}
                                        className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                            ${currentCategory == cat.id
                                                ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                            }`}
                                        title={cat.name}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div className={`pb-8 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Thương Hiệu</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => updateFilter('brand', '')}
                                    className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                        ${!currentBrand
                                            ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                            : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                        }`}
                                >
                                    Tất cả
                                </button>
                                {brands.map(brand => (
                                    <button
                                        key={brand.id}
                                        onClick={() => updateFilter('brand', brand.id)}
                                        className={`px-3 py-2 text-center text-xs transition-all duration-300 rounded-md border truncate
                                            ${currentBrand == brand.id
                                                ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                            }`}
                                        title={brand.name}
                                    >
                                        {brand.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prices */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50/50 text-amber-600'}`}>
                                    <Banknote className="w-4 h-4" />
                                </div>
                                <h3 className={`text-[11px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-700'}`}>Khoảng Giá</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: 'Tất cả giá', min: '', max: '' },
                                    { label: 'Dưới 10 triệu', min: '0', max: '10000000' },
                                    { label: '10 - 50 triệu', min: '10000000', max: '50000000' },
                                    { label: '50 - 200 triệu', min: '50000000', max: '200000000' },
                                    { label: 'Trên 200 triệu', min: '200000000', max: '' },
                                ].map((tier, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            const newParams = new URLSearchParams(searchParams);
                                            if (tier.min) newParams.set('min_price', tier.min); else newParams.delete('min_price');
                                            if (tier.max) newParams.set('max_price', tier.max); else newParams.delete('max_price');
                                            setSearchParams(newParams);
                                        }}
                                        className={`px-4 py-3 text-left text-xs transition-all duration-300 rounded-md border
                                            ${currentMinPrice === tier.min && currentMaxPrice === tier.max
                                                ? (isDark ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-200 bg-amber-50 text-amber-700')
                                                : (isDark ? 'border-white/5 text-zinc-700 hover:border-white/20 hover:text-zinc-300' : 'border-zinc-100 text-zinc-700 hover:border-zinc-200 hover:text-zinc-900')
                                            }`}
                                    >
                                        {tier.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full py-4 mt-2 bg-amber-600 text-white text-[11px] uppercase font-bold  rounded-md hover:bg-amber-700 transition-colors"
                    >
                        Áp dụng kết quả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientProductListPage;