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
        address: user?.address || '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/20 group-hover:border-amber-500/50 transition-colors shadow-lg">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                <User className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors shadow-lg border-2 border-white dark:border-zinc-900"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white mb-1 tracking-tight">{user?.full_name || user?.username}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-light mb-4">{user?.email}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs uppercase tracking-[0.1em] font-bold">
                        {user?.role || 'Khách hàng'}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Họ và tên</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all shadow-sm dark:shadow-none"
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Tên đăng nhập (Cố định)</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl py-3 pl-12 pr-4 text-zinc-400 dark:text-zinc-600 cursor-not-allowed font-light"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Email (Cố định)</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl py-3 pl-12 pr-4 text-zinc-400 dark:text-zinc-600 cursor-not-allowed font-light"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-amber-600/20 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Cập nhật thông tin
                            </>
                        )}
                    </button>
                    <p className="mt-4 text-xs text-zinc-500 font-light text-center md:text-left italic">
                        * Bạn có thể quản lý thông tin giao hàng tại tab <b>Sổ địa chỉ</b>.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ProfileInfoTab;
