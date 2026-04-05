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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 px-4 md:px-6 transition-colors duration-500">
            {/* Background Glows for Dark Mode */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/20 blur-[120px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-amber-600/10 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 sticky top-24 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-amber-500/20 shadow-inner">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-zinc-900 dark:text-white font-medium truncate">{user?.full_name || user?.username}</h3>
                                    <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                                            activeTab === tab.id
                                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <tab.icon className={`w-5 h-5 transition-colors ${
                                                activeTab === tab.id 
                                                ? 'text-white' 
                                                : 'text-zinc-400 dark:text-zinc-500 group-hover:text-amber-600 dark:group-hover:text-amber-500'
                                            }`} />
                                            <span className="text-sm font-medium">{tab.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {tab.count !== undefined && tab.count > 0 && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                                    activeTab === tab.id 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                                                }`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                            <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                                                activeTab === tab.id ? 'text-white/40' : 'text-zinc-300 dark:text-zinc-600'
                                            }`} />
                                        </div>
                                    </button>
                                ))}

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white transition-all group"
                                    >
                                        <LayoutDashboard className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-amber-600 dark:group-hover:text-amber-500" />
                                        <span className="text-sm font-medium">Trang quản trị</span>
                                    </Link>
                                )}

                                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                                    >
                                        <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                                        <span className="text-sm font-medium">Đăng xuất</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 rounded-[2rem] p-6 md:p-10 shadow-xl shadow-zinc-200/40 dark:shadow-none transition-all">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Wishlist Tab Component
const WishlistTab = ({ wishlist, toggleWishlist }) => {
    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed">
                <Heart className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 font-medium">Danh sách trống</h3>
                <p className="text-zinc-500 font-light max-w-xs mx-auto">Sản phẩm bạn yêu thích sẽ được lưu giữ tại đây để bạn dễ dàng tìm lại.</p>
                <Link to="/products">
                    <Button variant="outline" className="mt-6 px-10 h-12 rounded-xl uppercase text-[10px] font-bold tracking-widest border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                        Khám phá ngay
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white mb-8">Sản phẩm yêu thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md dark:shadow-none">
                        <button
                            onClick={() => toggleWishlist(item)}
                            className="absolute top-6 right-6 z-10 w-8 h-8 bg-black/5 dark:bg-black/40 text-red-500 dark:text-red-400 hover:bg-black/10 dark:hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <Link to={`/products/${item.slug}`} className="block aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 mb-4 shadow-inner">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </Link>

                        <Link to={`/products/${item.slug}`}>
                            <h4 className="text-zinc-900 dark:text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {item.name}
                            </h4>
                        </Link>

                        <p className="text-amber-600 dark:text-amber-500 font-serif font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
