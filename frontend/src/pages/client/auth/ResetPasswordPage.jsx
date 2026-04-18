import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ChevronLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import authApi from '../../../api/auth.api';
import loginImg from '../../../assets/login.jpg';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword(token, passwords.newPassword);
            setIsSuccess(true);
            toast.success('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.message || 'Token không hợp lệ hoặc đã hết hạn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-zinc-50 flex flex-col md:flex-row overflow-hidden italic-fade-in font-sans">
            {/* Left Column: Image (Prestige Background) */}
            <div className="hidden md:flex md:w-3/5 relative overflow-hidden h-full">
                <img
                    src={loginImg}
                    alt="Luxury Watch Collection"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/40 via-transparent to-white/10 mix-blend-multiply opacity-40"></div>
                <div className="absolute inset-0 bg-zinc-900/10"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-16 text-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-px h-12 bg-amber-500/50"></div>
                        <h1 className="text-4xl font-heading font-light text-white">CHRONOS</h1>
                    </div>

                    <div className="max-w-xl">
                        <span className="text-amber-400 text-xs uppercase mb-4 block font-medium font-heading">Security & Privacy</span>
                        <h2 className="text-5xl lg:text-6xl font-heading leading-tight mb-6">Thiết lập lại bảo mật.</h2>
                        <div className="w-20 h-px bg-amber-500/30 mb-6"></div>
                        <p className="text-zinc-100 font-light italic text-xl leading-relaxed">
                            "Sự an tâm của Quý khách là ưu tiên hàng đầu trong mọi nhịp đập của Chronos."
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] uppercase text-zinc-300 font-medium">
                        <span>Heritage</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Trust</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Security</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-2/5 flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-y-auto h-full scrollbar-hide shadow-[-10px_0_50px_rgba(0,0,0,0.03)] border-l border-zinc-100">
                <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="max-w-sm w-full relative z-10">
                    {!isSuccess ? (
                        <>
                            <div className="mb-12">
                                <h3 className="text-3xl font-heading text-zinc-900 mb-3">Đặt lại mật khẩu</h3>
                                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 group">
                                    <Label className="text-xs text-zinc-500 group-focus-within:text-amber-600 transition-colors">
                                        Mật khẩu mới
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            variant="light"
                                            icon={Lock}
                                            placeholder="••••••••"
                                            value={passwords.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <Label className="text-xs text-zinc-500 group-focus-within:text-amber-600 transition-colors">
                                        Xác nhận mật khẩu
                                    </Label>
                                    <Input
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        variant="light"
                                        icon={Lock}
                                        placeholder="••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="full"
                                    loading={loading}
                                    className="h-12 text-xs uppercase tracking-widest font-bold mt-8"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Lock className="w-4 h-4 mr-2" />
                                    )}
                                    Cập nhật mật khẩu
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center italic-fade-in">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-green-600 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-heading text-zinc-900 mb-4">Thành công!</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed mb-10">
                                Mật khẩu của bạn đã được cập nhật thành công.
                                Bạn sẽ được chuyển hướng về trang đăng nhập trong giây lát.
                            </p>
                            <Link to="/login">
                                <Button variant="primary" size="full" className="h-12 uppercase tracking-widest text-[10px] font-bold">
                                    Đăng nhập ngay
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* <div className="mt-20 border-t border-zinc-100 pt-6 text-[10px] text-center text-zinc-400 font-heading uppercase tracking-widest">
                        &copy; MMXXIV Chronos Prestige Group
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
