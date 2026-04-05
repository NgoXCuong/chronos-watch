import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ShoppingCart, Search, User, Menu, X,
    LogOut, Settings, FileText, ChevronDown, Sun, Moon,
    Heart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import categoryApi from '../../api/category.api';
import brandApi from '../../api/brand.api';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();

    const isDark = theme === 'dark';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([categoryApi.getAll(), brandApi.getAll()]);
                setCategories((Array.isArray(catRes) ? catRes : catRes?.data || []).filter(c => c.isActive !== false));
                setBrands((Array.isArray(brandRes) ? brandRes : brandRes?.data || []).filter(b => b.isActive !== false));
            } catch (err) { console.error('Failed to fetch menu data', err); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setActiveDropdown(null);
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleLogout = () => { logout(); navigate('/'); };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Theme-aware classes
    const headerBg = scrolled
        ? (isDark
            ? 'bg-zinc-950/95 backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.5)] border-b border-white/5'
            : 'bg-white/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-black/5')
        : (isDark
            ? 'bg-zinc-950 border-b border-white/5'
            : 'bg-white border-b border-zinc-100');

    const announceBg = isDark ? 'bg-zinc-900/50 border-b border-white/5' : 'bg-zinc-50 border-b border-zinc-100';
    const announceText = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const logoText = isDark ? 'text-zinc-100 hover:text-amber-400' : 'text-zinc-900 hover:text-amber-600';
    const logoSub = isDark ? 'text-zinc-600' : 'text-zinc-400';
    const navLink = isDark
        ? 'text-zinc-300 hover:text-amber-400'
        : 'text-zinc-600 hover:text-amber-600';
    const iconBtn = isDark
        ? 'text-zinc-400 hover:text-amber-400'
        : 'text-zinc-500 hover:text-amber-600';
    const dropBg = isDark
        ? 'bg-zinc-950/98 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
        : 'bg-white border-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)]';
    const dropLabel = isDark ? 'text-amber-500/70' : 'text-amber-600/70';
    const dropItem = isDark
        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50';
    const dropDot = isDark ? 'group-hover/item:bg-amber-500' : 'group-hover/item:bg-amber-500';

    return (
        <>
            <header
                ref={navRef}
                className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 ${headerBg}`}
            >
                {/* Announcement bar */}
                <div className={`${announceBg} hidden md:block`}>
                    <div className="max-w-[1400px] mx-auto px-8 h-6 flex items-center justify-between">
                        <span className={`text-[10px]  uppercase ${announceText}`}>
                            Vận chuyển miễn phí cho đơn hàng trên 5.000.000₫
                        </span>
                        <div className="flex items-center gap-6">
                            {isAuthenticated ? (
                                <span className={`text-[10px]  uppercase ${announceText}`}>
                                    Xin chào, <span className="text-amber-500 dark:text-amber-400">{user?.full_name || user?.username}</span>
                                </span>
                            ) : (
                                <div className={`flex items-center gap-4 text-[10px]  uppercase ${announceText}`}>
                                    <Link to="/login" className="hover:text-amber-500 transition-colors">Đăng nhập</Link>
                                    <span className={isDark ? 'text-zinc-700' : 'text-zinc-300'}>|</span>
                                    <Link to="/register" className="hover:text-amber-500 transition-colors">Đăng ký</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main nav */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Mobile toggle */}
                        <button
                            className={`md:hidden p-2 -ml-2 transition-colors ${iconBtn}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Left nav (desktop) */}
                        <nav className="hidden md:flex items-center gap-10 flex-1">
                            {/* Collections */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('collections')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to="/products"
                                    className={`flex items-center gap-1 text-[11px] font-semibold uppercase transition-colors duration-300 py-2 ${navLink}`}
                                >
                                    Bộ Sưu Tập
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'collections' ? 'rotate-180 text-amber-500' : ''}`} />
                                </Link>

                                {activeDropdown === 'collections' && (
                                    <div className={`absolute top-full left-0 mt-0 w-56 border backdrop-blur-2xl animate-fadeInDown ${dropBg}`}>
                                        <div className="py-2">
                                            <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                                <p className={`text-[12px] font-bold uppercase ${dropLabel}`}>Danh Mục</p>
                                            </div>
                                            {(categories.length > 0 ? categories : [
                                                { _id: '1', name: 'Đồng Hồ Nam', slug: 'nam' },
                                                { _id: '2', name: 'Đồng Hồ Nữ', slug: 'nu' },
                                                { _id: '3', name: 'Automatic', slug: 'automatic' },
                                                { _id: '4', name: 'Smartwatch', slug: 'smartwatch' },
                                                { _id: '5', name: 'Limited Edition', slug: 'limited' },
                                            ]).slice(0, 8).map((cat, idx) => (
                                                <Link
                                                    key={cat.id || cat._id || `cat-${idx}`}
                                                    to={`/products?category=${cat.slug || cat.id || cat._id}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className={`flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase transition-all duration-200 group/item ${dropItem}`}
                                                >
                                                    <span className={`w-1 h-1 rounded-full bg-amber-500/0 transition-all duration-300 ${dropDot}`}></span>
                                                    {cat.name}
                                                </Link>
                                            ))}
                                            <div className={`mt-2 pt-2 border-t px-4 pb-2 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                                <Link to="/products" className="text-[10px] text-amber-500 hover:text-amber-400 uppercase font-bold transition-colors">
                                                    Xem tất cả →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Brands */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('brands')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to="/brands"
                                    className={`flex items-center gap-1 text-[11px] font-semibold uppercase transition-colors duration-300 py-2 ${navLink}`}
                                >
                                    Thương Hiệu
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'brands' ? 'rotate-180 text-amber-500' : ''}`} />
                                </Link>

                                {activeDropdown === 'brands' && (
                                    <div className={`absolute top-full left-0 mt-0 w-56 border backdrop-blur-2xl animate-fadeInDown ${dropBg}`}>
                                        <div className="py-2">
                                            <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                                <p className={`text-[12px] font-bold uppercase ${dropLabel}`}>Thương Hiệu</p>
                                            </div>
                                            {(brands.length > 0 ? brands : [
                                                { _id: '1', name: 'Rolex' }, { _id: '2', name: 'Omega' },
                                                { _id: '3', name: 'Patek Philippe' }, { _id: '4', name: 'Cartier' },
                                                { _id: '5', name: 'Tag Heuer' },
                                            ]).slice(0, 8).map((brand, idx) => (
                                                <Link
                                                    key={brand.id || brand._id || `brand-${idx}`}
                                                    to={`/products?brand=${brand.slug || brand.id || brand._id}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className={`flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase transition-all duration-200 group/item ${dropItem}`}
                                                >
                                                    <span className={`w-1 h-1 rounded-full bg-amber-500/0 transition-all duration-300 ${dropDot}`}></span>
                                                    {brand.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/about" className={`text-[11px] font-semibold uppercase transition-colors duration-300 ${navLink}`}>
                                Về Chúng Tôi
                            </Link>
                        </nav>

                        {/* Center Logo */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Link to="/" className="flex flex-col items-center group">
                                <span className={`text-xl md:text-2xl font-bold  uppercase transition-colors duration-500 ${logoText}`}
                                    style={{ fontFamily: 'Georgia, serif' }}>
                                    CHRONOS
                                </span>
                                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent w-full mt-0.5 group-hover:via-amber-500 transition-all duration-500"></div>
                                <span className={`text-[10px]  uppercase mt-0.5 transition-colors duration-500 ${logoSub}`}>TIMEPIECES</span>
                            </Link>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
                            {/* Search */}
                            <div className="relative">
                                <button onClick={() => setSearchOpen(!searchOpen)} className={`p-1.5 transition-colors duration-300 ${iconBtn}`}>
                                    <Search className="w-[18px] h-[18px]" />
                                </button>
                                {searchOpen && (
                                    <div className={`absolute top-full right-0 mt-4 w-72 border backdrop-blur-2xl animate-fadeInDown ${dropBg}`}>
                                        <form onSubmit={handleSearch} className="flex items-center">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="Tìm kiếm sản phẩm..."
                                                className={`flex-1 bg-transparent px-4 py-3.5 text-sm outline-none  ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`}
                                            />
                                            <button type="submit" className="px-4 py-3.5 text-amber-500 hover:text-amber-400 transition-colors">
                                                <Search className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-1.5 transition-all duration-300 rounded-full ${isDark ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-zinc-500 hover:text-amber-600 hover:bg-amber-50'}`}
                                aria-label="Toggle theme"
                                title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
                            >
                                {isDark
                                    ? <Sun className="w-[18px] h-[18px]" />
                                    : <Moon className="w-[18px] h-[18px]" />
                                }
                            </button>

                            {/* User */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('user')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link to={isAuthenticated ? '/profile' : '/login'} className={`p-1.5 block transition-colors duration-300 ${iconBtn}`}>
                                    <User className="w-[18px] h-[18px]" />
                                </Link>
                                {isAuthenticated && activeDropdown === 'user' && (
                                    <div className={`absolute top-full right-0 mt-4 w-52 border backdrop-blur-2xl animate-fadeInDown ${dropBg}`}>
                                        {/* Cầu nối vô hình giúp giữ trạng thái hiển thị khi di chuột từ icon xuống menu */}
                                        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
                                        <div className={`px-4 py-3.5 border-b ${isDark ? 'border-white/8' : 'border-zinc-100'}`}>
                                            <p className="text-[9px] text-amber-500 uppercase  mb-1">Thành Viên</p>
                                            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user?.full_name || user?.username}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" className={`flex items-center gap-3 px-4 py-2.5 text-[11px]  uppercase transition-all ${dropItem}`}>
                                                <Settings className="w-3.5 h-3.5" /> Hồ Sơ
                                            </Link>
                                            <Link to="/orders" className={`flex items-center gap-3 px-4 py-2.5 text-[11px]  uppercase transition-all ${dropItem}`}>
                                                <FileText className="w-3.5 h-3.5" /> Đơn Hàng
                                            </Link>
                                            {user?.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-[11px]  uppercase text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 transition-all">
                                                    <Settings className="w-3.5 h-3.5" /> Quản Trị
                                                </Link>
                                            )}
                                        </div>
                                        <div className={`border-t py-1 ${isDark ? 'border-white/8' : 'border-zinc-100'}`}>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px]  uppercase text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all">
                                                <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link to="/wishlist" className={`relative p-1.5 transition-colors duration-300 ${iconBtn}`}>
                                <Heart className="w-[18px] h-[18px]" />
                                {wishlistCount > 0 && (
                                    <span className={`absolute -top-0.5 -right-0.5 min-w-[12px] h-3 px-1 flex items-center justify-center bg-red-500 text-[7px] text-white font-black rounded-full ring-2 ${isDark ? 'ring-zinc-950' : 'ring-white'}`}>
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className={`relative p-1.5 transition-colors duration-300 ${iconBtn}`}>
                                <ShoppingCart className="w-[18px] h-[18px]" />
                                {cartCount > 0 && (
                                    <span className={`absolute -top-0.5 -right-0.5 min-w-[12px] h-3 px-1 flex items-center justify-center bg-amber-500 text-[7px] text-white font-black rounded-full ring-2 ${isDark ? 'ring-zinc-950' : 'ring-white'}`}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Gold bottom line */}
                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`absolute top-0 left-0 bottom-0 w-[80vw] max-w-sm flex flex-col transition-transform duration-500 border-r ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'}`}>
                    <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-white/8' : 'border-zinc-100'}`}>
                        <Link to="/" className={`text-lg font-bold  uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMobileMenuOpen(false)}>
                            CHRONOS
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className={`p-1 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 pb-2">
                            <p className={`text-[9px]  uppercase px-2 mb-3 ${isDark ? 'text-amber-500/70' : 'text-amber-600/60'}`}>Menu</p>
                            {[
                                { label: 'Trang Chủ', to: '/' },
                                { label: 'Tất Cả Sản Phẩm', to: '/products' },
                                { label: 'Giỏ Hàng', to: '/cart' },
                                { label: 'Yêu Thích', to: '/wishlist' },
                            ].map((item, idx) => (
                                <Link key={item.to || idx} to={item.to}
                                    className={`flex px-2 py-3 text-sm rounded transition-all ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}`}
                                    onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Theme toggle mobile */}
                        <div className={`mx-4 mt-2 px-2 py-3 border rounded flex items-center justify-between ${isDark ? 'border-white/8' : 'border-zinc-100'}`}>
                            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Chế độ {isDark ? 'Tối' : 'Sáng'}</span>
                            <button onClick={toggleTheme} className={`flex items-center gap-2 text-[11px] font-bold uppercase  transition-colors ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                {isDark ? <><Sun className="w-4 h-4" /> Sáng</> : <><Moon className="w-4 h-4" /> Tối</>}
                            </button>
                        </div>
                    </nav>

                    <div className={`border-t px-6 py-5 ${isDark ? 'border-white/8' : 'border-zinc-100'}`}>
                        {isAuthenticated ? (
                            <div className="space-y-2">
                                <p className={`text-xs mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Xin chào, <span className="text-amber-500">{user?.full_name || user?.username}</span></p>
                                <Link to="/profile" className={`block py-1 text-sm transition-colors ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`} onClick={() => setMobileMenuOpen(false)}>Hồ Sơ</Link>
                                <Link to="/orders" className={`block py-1 text-sm transition-colors ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`} onClick={() => setMobileMenuOpen(false)}>Đơn Hàng</Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block py-1 text-sm text-red-400 hover:text-red-500 transition-colors">Đăng Xuất</button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login"
                                    className={`flex-1 text-center py-2.5 border text-sm transition-all ${isDark ? 'border-white/20 text-zinc-300 hover:text-white hover:border-white/40' : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400'}`}
                                    onClick={() => setMobileMenuOpen(false)}>Đăng Nhập</Link>
                                <Link to="/register"
                                    className="flex-1 text-center py-2.5 bg-amber-600 text-sm text-white hover:bg-amber-500 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}>Đăng Ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInDown { animation: fadeInDown 0.2s ease forwards; }
            `}</style>
        </>
    );
};

export default Navbar;