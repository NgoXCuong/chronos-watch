import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Field, PasswordField } from '@/components/market/Field';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ account: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.account || !credentials.password) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const data = await login(credentials);
            toast.success('Đăng nhập thành công!');

            if (data?.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Field
                id="account"
                label="Tài khoản (Email hoặc Username)"
                type="text"
                icon={Mail}
                placeholder="Nhập email hoặc username"
                value={credentials.account}
                onChange={handleChange}
                autoComplete="username"
                required
            />

            <PasswordField
                id="password"
                label="Mật khẩu"
                icon={Lock}
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword(prev => !prev)}
                autoComplete="current-password"
                required
            />

            <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                    <input
                        type="checkbox"
                        className="size-4 rounded-md accent-navy-600"
                    />
                    Ghi nhớ đăng nhập
                </label>
                <Link to="/forgot-password" className="font-semibold text-navy-600 hover:text-navy-800">
                    Quên mật khẩu?
                </Link>
            </div>

            <Button type="submit" variant="buy" size="full" loading={loading}>
                <LogIn size={16} strokeWidth={2} aria-hidden="true" />
                Đăng Nhập
            </Button>
        </form>
    );
};

export default LoginForm;
