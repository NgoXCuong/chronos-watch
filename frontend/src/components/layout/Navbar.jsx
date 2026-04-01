import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, Sun, Moon, LogOut, Package, UserCircle, ChevronRight, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '@/lib/utils';
import {
    DropdownMenuGroup,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20); // trigger earlier since top bar disappears
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Sản Phẩm', path: '/products' },
        { name: 'Thương Hiệu', path: '/brands' },
        { name: 'Di Sản', path: '/heritage' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header role="banner" className="font-sans relative z-50">
            {/* Top Bar - Disappears on scroll */}
            <div className={cn(
                "w-full bg-zinc-900 border-b border-white/10 text-zinc-300 py-1.5 px-6 transition-all duration-300 flex items-center justify-between text-[10px] uppercase tracking-widest",
                isScrolled ? "h-0 opacity-0 overflow-hidden py-0 border-transparent" : "h-auto opacity-100"
            )}>
                <div className="container mx-auto flex items-center justify-between">
                    <p className="hidden sm:block">Chính Hãng 100% • Bảo Hành 5 Năm Toàn Cầu</p>
                    <div className="flex items-center gap-6 w-full justify-center sm:w-auto sm:justify-end">
                        <a href="tel:0988123456" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone size={10} /> Hotline: 0988.123.456
                        </a>
                        <span className="hidden sm:inline">|</span>
                        <button className="hover:text-white transition-colors hidden sm:block focus:outline-none">VN (VND)</button>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav
                role="navigation"
                aria-label="Main Navigation"
                className={cn(
                    "w-full transition-all duration-500",
                    isScrolled
                        ? "fixed top-0 left-0 bg-background/90 backdrop-blur-md border-b border-border py-4 lg:py-4 shadow-lg"
                        : "absolute top-[auto] left-0 bg-transparent py-5 lg:py-6"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Mobile Menu Toggle (Left on Mobile) */}
                    <button
                        className="lg:hidden text-foreground hover:text-primary transition-colors focus:outline-none"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Mở menu điều hướng"
                        aria-expanded={mobileMenuOpen}
                    >
                        <Menu size={24} strokeWidth={1.5} />
                    </button>

                    {/* Left: Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-8 w-1/3">
                        {navLinks.map((link) => (
                            <div key={link.name} className="group relative">
                                <Link
                                    to={link.path}
                                    className={cn(
                                        "text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-medium py-2",
                                        isScrolled || theme === 'light' ? "text-muted-foreground group-hover:text-primary" : "text-zinc-300 drop-shadow-sm group-hover:text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                                {/* Active subtle indicator line */}
                                <div className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full",
                                    isScrolled || theme === 'light' ? "bg-primary" : "bg-white"
                                )}></div>

                                {/* Simple Dropdown for Products (as example) */}
                                {link.path === '/products' && (
                                    <div className="absolute top-full left-0 pt-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-background border border-border/50 shadow-2xl p-5 w-56 flex flex-col gap-1 rounded-sm">
                                            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-2 border-b border-border pb-2">Danh mục</p>
                                            <Link to="/products?category=dong-ho-nam" className="text-xs text-foreground/80 hover:text-primary hover:bg-accent -mx-2 px-2 transition-colors py-2 font-medium">Đồng Hồ Nam</Link>
                                            <Link to="/products?category=dong-ho-nu" className="text-xs text-foreground/80 hover:text-primary hover:bg-accent -mx-2 px-2 transition-colors py-2 font-medium">Đồng Hồ Nữ</Link>
                                            <Link to="/products?category=dong-ho-co-tu-dong" className="text-xs text-foreground/80 hover:text-primary hover:bg-accent -mx-2 px-2 transition-colors py-2 font-medium">Cơ (Automatic)</Link>
                                            <Link to="/products?category=dong-ho-pin-quartz" className="text-xs text-foreground/80 hover:text-primary hover:bg-accent -mx-2 px-2 transition-colors py-2 font-medium">Pin (Quartz)</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center: Logo */}
                    <Link to="/" aria-label="Trang chủ CHRONOS" className="lg:w-1/3 flex flex-col items-center justify-center">
                        <span className={cn(
                            "font-heading tracking-[0.4em] uppercase transition-colors duration-500",
                            isScrolled || theme === 'light' ? "text-foreground" : "text-white drop-shadow-md",
                            isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
                        )}>CHRONOS</span>
                        {!isScrolled && <span className="h-px bg-primary/50 w-8 mt-1.5 block"></span>}
                    </Link>

                    {/* Right: Icons */}
                    <div className="flex items-center justify-end gap-5 lg:gap-6 w-1/3 text-muted-foreground">
                        <button aria-label="Tìm kiếm" className={cn(
                            "hover:text-primary transition-colors hidden sm:block focus:outline-none",
                            !(isScrolled || theme === 'light') && "text-zinc-300 hover:text-white drop-shadow-sm"
                        )}>
                            <Search size={18} strokeWidth={1.5} />
                        </button>

                        <Link to="/wishlist" aria-label="Danh sách yêu thích" className={cn(
                            "hover:text-primary transition-colors relative hidden sm:block",
                            !(isScrolled || theme === 'light') && "text-zinc-300 hover:text-white drop-shadow-sm"
                        )}>
                            <Heart size={18} strokeWidth={1.5} />
                        </Link>

                        <Link to="/cart" aria-label="Giỏ hàng" className={cn(
                            "hover:text-primary transition-colors relative group",
                            !(isScrolled || theme === 'light') && "text-zinc-300 hover:text-white drop-shadow-sm"
                        )}>
                            <ShoppingBag size={18} strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center font-bold">0</span>
                        </Link>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <div aria-label="Tài khoản" className={cn(
                                        "hover:text-primary transition-colors cursor-pointer",
                                        !(isScrolled || theme === 'light') && "text-zinc-300 hover:text-white drop-shadow-sm"
                                    )}>
                                        <User size={18} strokeWidth={1.5} />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-4 bg-background/95 backdrop-blur-md border-border shadow-2xl p-2 font-sans rounded-none z-[100]" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="px-4 py-3">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-xs font-bold tracking-widest uppercase text-foreground">Tài Khoản</p>
                                                <p className="text-[10px] text-muted-foreground leading-none">{user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border/50" />

                                        <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-accent focus:bg-accent transition-colors group">
                                            <UserCircle className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <Link to="/profile" className="text-[11px] uppercase tracking-widest text-foreground font-medium">Hồ sơ cá nhân</Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-accent focus:bg-accent transition-colors group">
                                            <Package className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <Link to="/orders" className="text-[11px] uppercase tracking-widest text-foreground font-medium">Đơn hàng của tôi</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={toggleTheme}
                                            className="px-4 py-3 cursor-pointer hover:bg-accent focus:bg-accent transition-colors group"
                                        >
                                            {theme === 'light' ? (
                                                <Moon className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            ) : (
                                                <Sun className="mr-3 h-4 w-4 text-amber-500" />
                                            )}
                                            <span className="text-[11px] uppercase tracking-widest text-foreground font-medium">
                                                {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="px-4 py-3 cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 transition-colors group"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-destructive" />
                                        <span className="text-[11px] uppercase tracking-widest text-destructive font-bold">Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/login" className={cn(
                                "hidden lg:block text-[10px] uppercase tracking-widest border px-5 py-2 transition-all focus:outline-none rounded-none outline-offset-0",
                                isScrolled || theme === 'light'
                                    ? "text-foreground border-foreground hover:bg-foreground hover:text-background"
                                    : "text-white border-white hover:bg-white hover:text-black backdrop-blur-sm"
                            )}>
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay (Left side slide) */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
                    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Mobile Sidebar HTML Drawer (Slide in from left) */}
            <div className={cn(
                "fixed top-0 left-0 h-[100dvh] w-[85%] max-w-[340px] bg-background border-r border-border z-[70] lg:hidden flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-2xl",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <span className="font-heading tracking-[0.3em] uppercase text-xl text-foreground">CHRONOS</span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Đóng menu"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm transition-colors"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Mobile Search Input */}
                <div className="px-6 pt-6 mb-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Tìm kiếm đồng hồ..." className="w-full h-10 bg-accent text-sm text-foreground pl-10 pr-4 outline-none border border-border focus:border-primary transition-colors" />
                    </div>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-medium uppercase tracking-widest text-foreground hover:text-primary flex items-center justify-between border-b border-border/50 pb-4"
                        >
                            {link.name}
                            <ChevronRight size={16} className="text-muted-foreground/50" />
                        </Link>
                    ))}

                    <div className="mt-4 flex flex-col gap-4">
                        {!isAuthenticated && (
                            <Link
                                to="/login"
                                className="w-full text-center py-4 bg-foreground text-background uppercase tracking-[0.2em] font-semibold text-xs border border-transparent hover:bg-primary transition-colors"
                            >
                                Đăng Nhập
                            </Link>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="w-full text-center py-4 bg-accent text-foreground uppercase tracking-[0.2em] font-semibold text-xs flex items-center justify-center gap-2 border border-border"
                        >
                            {theme === 'light' ? (
                                <><Moon size={14} strokeWidth={2} /> Chế Độ Tối</>
                            ) : (
                                <><Sun size={14} className="text-amber-500" strokeWidth={2} /> Chế Độ Sáng</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Footer Info */}
                <div className="p-6 border-t border-border/50 bg-accent/20">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/wishlist" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <Heart size={18} strokeWidth={1.5} />
                            <span className="text-[9px] uppercase tracking-widest font-semibold">Yêu Thích</span>
                        </Link>
                        <Link to="/cart" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <div className="relative">
                                <ShoppingBag size={18} strokeWidth={1.5} />
                                <span className="absolute -top-1.5 -right-2 bg-primary text-background text-[8px] min-w-[12px] h-[12px] rounded-full flex items-center justify-center font-bold">0</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest font-semibold">Giỏ Hàng</span>
                        </Link>
                        {isAuthenticated && (
                            <Link to="/profile" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[9px] uppercase tracking-widest font-semibold">Tài Khoản</span>
                            </Link>
                        )}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2 border-t border-border/50 pt-4">
                        <Phone size={12} /> Hotline: 0988.123.456
                    </p>
                </div>
            </div>

        </header>
    );
};

export default Navbar;
