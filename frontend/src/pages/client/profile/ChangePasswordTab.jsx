import React, { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, ShieldCheck, Eye, EyeOff, Save } from 'lucide-react';
import authApi from '../../../api/auth.api';

const ChangePasswordTab = () => {
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu mới không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            await authApi.changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            toast.success('Đổi mật khẩu thành công');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error.response?.data?.message || 'Mật khẩu cũ không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Security Narrative Header */}
            <div className="text-center space-y-2 mb-10">
                <div className="w-16 h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="text-[12px] font-black  text-amber-600 dark:text-amber-500 uppercase">Vault Security</span>
                <h2 className="text-2xl md:text-3xl font-serif font-light text-zinc-900 dark:text-white ">Bảo Mật <span className="italic text-zinc-600">Tài Khoản</span></h2>
                <div className="h-px w-12 bg-zinc-100 dark:bg-zinc-800 mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    {/* Old Password */}
                    <div className="space-y-2">
                        <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative group">
                            <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type={showPasswords.old ? 'text' : 'password'}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 pl-7 pr-12 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-400"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('old')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-700 dark:hover:text-white p-2 transition-colors"
                            >
                                {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700">
                                Mật khẩu mới
                            </label>
                            <div className="relative group">
                                <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 pl-7 pr-12 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-400"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-700 dark:hover:text-white p-2 transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-black uppercase  text-zinc-800 dark:text-zinc-700">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative group">
                                <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 dark:text-zinc-700 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 pl-7 pr-12 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-400"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-700 dark:hover:text-white p-2 transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[12px] text-zinc-600 font-light italic text-center md:text-left">
                        Mật khẩu phức tạp nâng cao tính bảo mật.
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all font-black text-[12px] uppercase  shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                Đổi mật khẩu
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordTab;
