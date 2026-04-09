import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    User,
    ShoppingBag,
    Heart,
    ShieldCheck,
    LogOut,
    ChevronRight,
    LayoutDashboard,
    MapPin
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import ProfileInfoTab from './ProfileInfoTab';
import OrderHistoryTab from './OrderHistoryTab';
import ChangePasswordTab from './ChangePasswordTab';
import AddressTab from './AddressTab';
import { useWishlist } from '../../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

    // Get tab from URL hash or default to 'profile'
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['profile', 'orders', 'wishlist', 'security', 'addresses'].includes(hash)) {
            setActiveTab(hash);
        }
    }, [location]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        navigate(`/profile#${tabId}`);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const tabs = [
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
        { id: 'addresses', label: 'Sổ địa chỉ', icon: MapPin },
        { id: 'orders', label: 'Đơn hàng của tôi', icon: ShoppingBag },
        { id: 'wishlist', label: 'Danh sách yêu thích', icon: Heart, count: wishlistCount },
        { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileInfoTab />;
            case 'addresses': return <AddressTab />;
            case 'orders': return <OrderHistoryTab />;
            case 'security': return <ChangePasswordTab />;
            case 'wishlist': return <WishlistTab wishlist={wishlist} toggleWishlist={toggleWishlist} />;
            default: return <ProfileInfoTab />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pt-10 pb-10 px-4 md:px-8 font-sans selection:bg-amber-500/30">
            {/* Background Narrative Layers - Subtle */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[2%] right-[5%] w-[25%] h-[25%] rounded-full bg-amber-200/10 dark:bg-amber-900/5 blur-[80px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                {/* Header Page - Simplified */}
                <div className="text-center space-y-3 mb-10">
                    <span className="text-[12px] font-black  text-amber-600 dark:text-amber-500 uppercase">
                        The Chronos Identity
                    </span>
                    <h1 className="text-3xl md:text-5xl text-zinc-900 dark:text-white leading-tight font-light ">
                        Hồ Sơ <span className="italic font-serif text-zinc-600 dark:text-zinc-700">Cá Nhân</span>
                    </h1>
                    <div className="h-px w-16 bg-zinc-200 dark:bg-zinc-800 mx-auto mt-4"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Navigation - Optimized Spacing */}
                    <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
                        <div className="space-y-8 group/sidebar">
                            {/* User Summary Card */}
                            <div className="flex items-center gap-3 px-2">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg group-hover/sidebar:border-amber-500/50 transition-all duration-700">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover/sidebar:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-950 shadow-sm" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase  truncate">
                                        {user?.full_name || user?.username}
                                    </h3>
                                    <p className="text-[12px] text-zinc-600 font-medium  uppercase">
                                        Chronos Member
                                    </p>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none gap-1.5">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-sm transition-all shrink-0 lg:w-full group",
                                            activeTab === tab.id
                                                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl"
                                                : "text-zinc-700 dark:text-zinc-600 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                                        )}
                                    >
                                        <tab.icon className={cn(
                                            "w-3.5 h-3.5 transition-colors",
                                            activeTab === tab.id ? "text-amber-500" : "text-zinc-600"
                                        )} />
                                        <span className="text-[10px] font-bold uppercase  whitespace-nowrap">
                                            {tab.label}
                                        </span>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className={cn(
                                                "ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full",
                                                activeTab === tab.id ? "bg-amber-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700"
                                            )}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-3 px-4 py-3 rounded-sm text-zinc-600 hover:text-blue-500 transition-all shrink-0 lg:w-full group"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase  whitespace-nowrap">Quản trị</span>
                                    </Link>
                                )}

                                <div className="hidden lg:block h-px w-full bg-zinc-300 dark:bg-zinc-800 my-4"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-sm text-rose-600 transition-all shrink-0 lg:w-full group"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase  whitespace-nowrap">Đăng xuất</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area - Simplified padding */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-sm p-6 md:p-8 shadow-sm relative overflow-hidden group/content">
                        {/* Decorative Background - Reduced opacity */}
                        <div className="absolute top-0 right-0 p-4 opacity-[0.01] group-hover/content:opacity-[0.02] transition-opacity duration-1000 -z-0">
                            <ShieldCheck size={300} />
                        </div>

                        <div className="relative z-10 min-h-[300px]">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Wishlist Tab Component - Optimized Spacing
const WishlistTab = ({ wishlist, toggleWishlist }) => {
    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-sm border border-zinc-200 dark:border-zinc-800 border-dashed">
                <Heart className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 font-medium">Danh sách trống</h3>
                <p className="text-xs text-zinc-600 font-light max-w-xs mx-auto italic">Sản phẩm bạn yêu thích sẽ được lưu giữ tại đây.</p>
                <Link to="/products">
                    <button className="mt-8 px-10 py-3 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white rounded-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all font-black text-[12px] uppercase ">
                        Khám phá ngay
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-light text-zinc-900 dark:text-white mb-6 ">Sản phẩm <span className="italic text-zinc-600">Yêu Thích</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-sm p-4 hover:border-amber-500/30 transition-all duration-500 shadow-sm">
                        <button
                            onClick={() => toggleWishlist(item)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/5 dark:bg-black/40 text-red-500 hover:bg-black/10 dark:hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                        >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <Link to={`/products/${item.slug}`} className="block aspect-square rounded-sm overflow-hidden bg-zinc-50 dark:bg-zinc-950 mb-4">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </Link>

                        <Link to={`/products/${item.slug}`}>
                            <h4 className="text-zinc-900 dark:text-white font-serif font-medium text-sm line-clamp-1 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {item.name}
                            </h4>
                        </Link>

                        <p className="text-amber-600 dark:text-amber-500 font-serif font-light text-xs">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
