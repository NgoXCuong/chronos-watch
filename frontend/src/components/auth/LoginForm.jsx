import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const LoginForm = ({ variant = 'dark' }) => {
    const isLight = variant === 'light';
    const [credentials, setCredentials] = useState({ account: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.account || !credentials.password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const data = await login(credentials);
            toast.success('Đăng nhập thành công!');

            // Redirect based on role
            if (data?.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác');
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className={cn(
                    "p-3 rounded-none flex items-start gap-2 text-sm border",
                    isLight
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-red-950/20 text-red-500 border-red-500/30"
                )}>
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-2 group">
                <Label className={cn(
                    "text-xs tracking-widest transition-colors duration-300",
                    isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                )}>
                    Tài khoản (Email hoặc Username)
                </Label>
                <Input
                    name="account"
                    type="text"
                    variant={variant}
                    icon={Mail}
                    placeholder="Nhập email hoặc username"
                    value={credentials.account}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2 group">
                <Label className={cn(
                    "text-xs tracking-widest transition-colors duration-300",
                    isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                )}>
                    Mật khẩu
                </Label>
                <Input
                    name="password"
                    type="password"
                    variant={variant}
                    icon={Lock}
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className={cn(
                            "rounded-none h-4 w-4",
                            isLight
                                ? "bg-white border-zinc-300 text-amber-600 focus:ring-amber-500/50"
                                : "bg-zinc-900 border-zinc-700 text-primary focus:ring-primary/50"
                        )}
                    />
                    <span className={isLight ? "text-zinc-600" : "text-zinc-400"}>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" title="Chưa hỗ trợ" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                    Quên mật khẩu?
                </Link>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="full"
                loading={loading}
            >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng Nhập
            </Button>

            <div className={cn(
                "text-center text-sm mt-6 pt-4 border-t",
                isLight ? "text-zinc-500 border-zinc-200" : "text-zinc-400 border-white/5"
            )}>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
