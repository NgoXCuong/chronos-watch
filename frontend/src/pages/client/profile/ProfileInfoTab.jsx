import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Camera, Save, User, Phone, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import authApi from '../../../api/auth.api';

const ProfileInfoTab = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
            });
            setAvatarPreview(user.avatar_url || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ảnh quá lớn (tối đa 2MB)');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('full_name', formData.full_name);
            data.append('phone', formData.phone);
            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await authApi.updateProfile(data);
            updateUser(response.data || response);
            toast.success('Cập nhật hồ sơ thành công');
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Artistic Header Section - Optimized Spacing */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="relative group">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 group-hover:border-amber-500/50 transition-all duration-700 shadow-xl">
                        <div className="w-full h-full rounded-sm overflow-hidden">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <User className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Camera Trigger - Smaller */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-xl border-[3px] border-white dark:border-zinc-900 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all transform hover:scale-110"
                    >
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-left space-y-1.5">
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[12px] font-black  mb-0.5">
                        {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif font-light text-zinc-900 dark:text-white ">
                        {user?.full_name || user?.username}
                    </h2>
                    <p className="text-[11px] text-zinc-600 font-light">
                        Thông tin định danh trên hệ thống Chronos.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black  text-zinc-600 dark:text-zinc-700">
                            Họ và tên
                        </label>
                        <div className="relative group">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 pl-6 pr-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600 dark:placeholder:text-zinc-700"
                                placeholder="Nhập tên của bạn"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black  text-zinc-600 dark:text-zinc-700">
                            Số điện thoại
                        </label>
                        <div className="relative group">
                            <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 pl-6 pr-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600 dark:placeholder:text-zinc-700"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black  text-zinc-600 dark:text-zinc-700">
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={user?.username || ''}
                                disabled
                                className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-900/40 py-2 text-sm text-zinc-600 cursor-not-allowed font-light"
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-zinc-500  ">Cố định</div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black   text-zinc-800 dark:text-zinc-700">
                            Địa chỉ thư điện tử
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-800/40 py-2 pl-6 text-sm text-zinc-600 dark:text-zinc-700 cursor-not-allowed font-light"
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-zinc-500  ">Cố định</div>
                        </div>
                    </div>
                </div>

                {/* Status Bar & Action - Condensed */}
                <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-6 md:mt-8">
                    <p className="text-[11px] text-zinc-600 font-light italic text-center md:text-left">
                        Thông tin được bảo mật theo tiêu chuẩn Chronos.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all font-black text-[11px] uppercase  shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5 transition-transform" />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileInfoTab;
