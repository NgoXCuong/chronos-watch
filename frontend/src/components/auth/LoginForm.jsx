import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const LoginForm = () => {
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
            await login(credentials);
            toast.success('Đăng nhập thành công!');
            navigate('/');
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
                <div className="bg-red-950/20 text-red-500 p-3 rounded-none flex items-start gap-2 text-sm border border-red-500/30">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-2 group">
                <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                    Tài khoản (Email hoặc Username)
                </Label>
                <Input
                    name="account"
                    type="text"
                    icon={Mail}
                    placeholder="Nhập email hoặc username"
                    value={credentials.account}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2 group">
                <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                    Mật khẩu
                </Label>
                <Input
                    name="password"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded-none bg-zinc-900 border-zinc-700 text-primary focus:ring-primary/50 h-4 w-4" />
                    <span className="text-zinc-400">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" title="Chưa hỗ trợ" className="text-primary hover:text-primary/80 font-medium transition-colors">
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

            <div className="text-center text-sm text-zinc-400 mt-6 pt-4 border-t border-white/5">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
