import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, Sun, Moon, LogOut, Package, UserCircle } from 'lucide-react';
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Bộ Sưu Tập', path: '/collections' },
        { name: 'Thương Hiệu', path: '/brands' },
        { name: 'Di Sản', path: '/heritage' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans",
            isScrolled
                ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-lg"
                : "bg-transparent py-6"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Left: Nav Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-medium",
                                isScrolled || theme === 'light' ? "text-muted-foreground hover:text-primary" : "text-zinc-400 hover:text-amber-500"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Center: Logo */}
                <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <h1 className={cn(
                        "font-heading tracking-[0.5em] transition-all duration-500",
                        isScrolled || theme === 'light' ? "text-foreground" : "text-white",
                        isScrolled ? "text-xl" : "text-2xl"
                    )}>CHRONOS</h1>
                    {!isScrolled && <div className="h-px bg-primary/50 w-8 mt-1"></div>}
                </Link>

                {/* Right: Icons */}
                <div className="flex items-center gap-6 text-muted-foreground">
                    <button className="hover:text-primary transition-colors hidden sm:block outline-none">
                        <Search size={18} strokeWidth={1.5} />
                    </button>

                    <Link to="/wishlist" className="hover:text-primary transition-colors relative">
                        <Heart size={18} strokeWidth={1.5} />
                    </Link>

                    <Link to="/cart" className="hover:text-primary transition-colors relative group">
                        <ShoppingBag size={18} strokeWidth={1.5} />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">0</span>
                    </Link>

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <div className="hover:text-primary transition-colors cursor-pointer">
                                    <User size={18} strokeWidth={1.5} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-4 bg-background/95 backdrop-blur-md border-border shadow-2xl p-2 font-sans rounded-none" align="end">
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

                                    <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-accent focus:bg-accent transition-colors group">
                                        <Heart className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        <Link to="/wishlist" className="text-[11px] uppercase tracking-widest text-foreground font-medium">Danh sách yêu thích</Link>
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
                            "hidden sm:block text-[10px] uppercase tracking-widest border px-4 py-1.5 transition-all outline-none",
                            isScrolled || theme === 'light' ? "text-foreground border-border hover:bg-accent" : "text-zinc-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500"
                        )}>
                            Đăng Nhập
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-zinc-950 z-[49] transition-transform duration-500 md:hidden flex flex-col items-center justify-center gap-8",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-heading tracking-[0.2em] text-zinc-100 hover:text-amber-500"
                    >
                        {link.name}
                    </Link>
                ))}
                {!isAuthenticated && (
                    <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 text-amber-500 uppercase tracking-widest text-sm font-semibold"
                    >
                        Đăng Nhập
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
