import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft, Loader2, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import authApi from '../../../api/auth.api';
import loginImg from '../../../assets/login.jpg';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSubmitted(true);
            toast.success('Yêu cầu đã được gửi! Vui lòng kiểm tra email.');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
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
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/40 via-transparent to-white/10 mix-blend-multiply opacity-40"></div>
                <div className="absolute inset-0 bg-zinc-900/10"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-16 text-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-px h-12 bg-amber-500/50"></div>
                        <h1 className="text-4xl font-heading font-light text-white">CHRONOS</h1>
                    </div>

                    <div className="max-w-xl">
                        <span className="text-amber-400 text-xs uppercase mb-4 block font-medium font-heading">Timeless Heritage</span>
                        <h2 className="text-5xl lg:text-6xl font-heading leading-tight mb-6">Khôi phục quyền truy cập.</h2>
                        <div className="w-20 h-px bg-amber-500/30 mb-6"></div>
                        <p className="text-zinc-100 font-light italic text-xl leading-relaxed">
                            "Thời gian không bao giờ dừng lại, và hành trình của bạn tại Chronos cũng vậy."
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] uppercase text-zinc-300 font-medium">
                        <span>Heritage</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Craftsmanship</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Exclusivity</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Content */}
            <div className="w-full md:w-2/5 flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-y-auto h-full scrollbar-hide shadow-[-10px_0_50px_rgba(0,0,0,0.03)] border-l border-zinc-100">
                <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="max-w-sm w-full relative z-10">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-[10px] uppercase  text-zinc-400 hover:text-amber-600 transition-colors mb-12 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại đăng nhập
                    </Link>

                    {!submitted ? (
                        <>
                            <div className="mb-12">
                                <h3 className="text-3xl font-heading text-zinc-900 mb-3">Quên mật khẩu?</h3>
                                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                                    Nhập email của bạn để nhận liên kết khôi phục mật khẩu.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2 group">
                                    <Label className="text-xs text-zinc-500 group-focus-within:text-amber-600 transition-colors">
                                        Địa chỉ Email
                                    </Label>
                                    <Input
                                        type="email"
                                        variant="light"
                                        icon={Mail}
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="full"
                                    loading={loading}
                                    className="h-12 text-xs uppercase  font-bold"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    Gửi yêu cầu
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center italic-fade-in">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="text-amber-600 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-heading text-zinc-900 mb-4">Kiểm tra Email</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed mb-10">
                                Chúng tôi đã gửi liên kết khôi phục mật khẩu đến <strong>{email}</strong>.
                                Vui lòng kiểm tra hộp thư đến (hoặc thư rác) của bạn.
                            </p>
                            <Button
                                variant="outline"
                                size="full"
                                onClick={() => setSubmitted(false)}
                                className="h-12 text-[10px] uppercase  border-zinc-200 text-zinc-500 hover:border-amber-600 hover:text-amber-600"
                            >
                                Gửi lại yêu cầu khác
                            </Button>
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

export default ForgotPasswordPage;
