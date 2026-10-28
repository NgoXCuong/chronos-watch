import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Watch, Heart, ShoppingCart, User, LogOut, Settings, FileText, LayoutDashboard, ShieldCheck } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HeaderSearch from './HeaderSearch';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const CountBadge = ({ count, tone = 'sale' }) =>
    count > 0 && (
        <span className={`absolute -top-1.5 -right-1.5 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-4 text-white ${tone === 'sale' ? 'bg-sale' : 'bg-navy-600'}`}>
            {count}
        </span>
    );

/** Header trắng 74px: logo | searchbar viền 2px navy + nút Tìm kiếm | tài khoản / yêu thích / giỏ hàng. */
const MarketHeader = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { notifications, unreadCount, markAllRead, markRead } = useNotificationsContext();

    return (
        <div className="flex h-[74px] items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-navy-600 text-white shadow-card">
                    <Watch size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="hidden flex-col leading-none sm:flex">
                    <span className="text-lg font-extrabold uppercase tracking-[0.14em] text-navy-900">Chronos</span>
                    <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Timepieces</span>
                </span>
            </Link>

            {/* Searchbar nằm giữa vùng trống giữa logo và khối tài khoản (form tự justify-center),
                không còn dính sát logo như trước. */}
            <HeaderSearch />

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 md:gap-2">
                {/* Chưa đăng nhập: ẩn hẳn avatar (đã có Đăng nhập/Đăng ký trên topbar) */}
                {isAuthenticated && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            aria-label="Tài khoản của tôi"
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
                        >
                            <span className="flex size-9 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                                <User size={18} strokeWidth={2} aria-hidden="true" />
                            </span>
                            <span className="hidden flex-col text-left leading-tight lg:flex">
                                <span className="text-xs text-muted-foreground">Tài khoản của tôi</span>
                                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                                    {user?.full_name || user?.username}
                                </span>
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>{user?.email || user?.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <Settings size={15} strokeWidth={2} aria-hidden="true" /> Hồ sơ của tôi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/orders')}>
                                <FileText size={15} strokeWidth={2} aria-hidden="true" /> Đơn hàng của tôi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                                <Heart size={15} strokeWidth={2} aria-hidden="true" /> Sản phẩm yêu thích
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/warranties')}>
                                <ShieldCheck size={15} strokeWidth={2} aria-hidden="true" /> Phiếu bảo hành
                            </DropdownMenuItem>
                            {user?.role === 'admin' && (
                                <DropdownMenuItem onClick={() => navigate('/admin')}>
                                    <LayoutDashboard size={15} strokeWidth={2} aria-hidden="true" /> Trang quản trị
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
                                <LogOut size={15} strokeWidth={2} aria-hidden="true" /> Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {isAuthenticated && (
                    <NotificationBell
                        notifications={notifications}
                        unreadCount={unreadCount}
                        onMarkAllRead={markAllRead}
                        onSelect={(notification) => {
                            markRead(notification.id);
                            if (notification.link) navigate(notification.link);
                        }}
                        footer={{ to: '/notifications', label: 'Xem tất cả thông báo' }}
                    />
                )}

                <Link to="/wishlist" aria-label="Danh sách yêu thích" className="relative flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-navy-600">
                    <Heart size={21} strokeWidth={2} aria-hidden="true" />
                    <CountBadge count={wishlistCount} tone="sale" />
                </Link>

                <Link to="/cart" aria-label="Giỏ hàng" className="relative flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-navy-600">
                    <ShoppingCart size={21} strokeWidth={2} aria-hidden="true" />
                    <CountBadge count={cartCount} tone="navy" />
                </Link>
            </div>
        </div>
    );
};

export default MarketHeader;
