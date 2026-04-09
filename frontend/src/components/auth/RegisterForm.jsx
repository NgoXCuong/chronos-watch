import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RegisterForm = ({ variant = 'dark' }) => {
    const isLight = variant === 'light';
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!userData.username) newErrors.username = 'Tên tài khoản là bắt buộc';
        if (!userData.email) newErrors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email không hợp lệ';
        if (!userData.password) newErrors.password = 'Mật khẩu là bắt buộc';
        else if (userData.password.length < 6) newErrors.password = 'Mật khẩu phải từ 6 ký tự';
        if (!userData.full_name) newErrors.full_name = 'Họ tên là bắt buộc';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await register(userData);
            toast.success('Đăng ký thành công! Hãy đăng nhập ngay.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Đăng ký thất bại';
            toast.error(msg);
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className={cn(
                    "p-3 rounded-none flex items-start gap-2 text-sm border",
                    isLight
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-red-950/20 text-red-500 border-red-500/30"
                )}>
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errors.general}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <Label className={cn(
                        "text-xs transition-colors duration-300",
                        isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                    )}>
                        Tên tài khoản
                    </Label>
                    <Input
                        name="username"
                        type="text"
                        variant={variant}
                        icon={User}
                        placeholder="Username của bạn"
                        value={userData.username}
                        onChange={handleChange}
                        error={errors.username}
                        required
                    />
                    {errors.username && <p className="text-[10px] uppercase text-red-500/80 font-medium">{errors.username}</p>}
                </div>

                <div className="space-y-2 group">
                    <Label className={cn(
                        "text-xs transition-colors duration-300",
                        isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                    )}>
                        Email
                    </Label>
                    <Input
                        name="email"
                        type="email"
                        variant={variant}
                        icon={Mail}
                        placeholder="Nhập email của bạn"
                        value={userData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />
                    {errors.email && <p className="text-[10px] uppercase text-red-500/80 font-medium">{errors.email}</p>}
                </div>
            </div>

            <div className="space-y-2 group">
                <Label className={cn(
                    "text-xs transition-colors duration-300",
                    isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                )}>
                    Họ và tên
                </Label>
                <Input
                    name="full_name"
                    type="text"
                    variant={variant}
                    icon={User}
                    placeholder="Họ và tên của bạn"
                    value={userData.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                    required
                />
                {errors.full_name && <p className="text-[10px] uppercase text-red-500/80 font-medium">{errors.full_name}</p>}
            </div>

            <div className="space-y-2 group">
                <Label className={cn(
                    "text-xs transition-colors duration-300",
                    isLight ? "text-zinc-500 group-focus-within:text-amber-600" : "text-zinc-400 group-focus-within:text-primary"
                )}>
                    Số điện thoại
                </Label>
                <Input
                    name="phone"
                    type="tel"
                    variant={variant}
                    icon={Phone}
                    placeholder="0987xxxxxx"
                    value={userData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                />
            </div>

            <div className="space-y-2 group">
                <Label className={cn(
                    "text-xs transition-colors duration-300",
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
                    value={userData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                {errors.password && <p className="text-[10px] uppercase text-red-500/80 font-medium">{errors.password}</p>}
            </div>

            <Button
                type="submit"
                variant="primary"
                size="full"
                loading={loading}
            >
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng Ký Tài Khoản
            </Button>

            <div className={cn(
                "text-center text-sm mt-6 pt-4 border-t",
                isLight ? "text-zinc-500 border-zinc-200" : "text-zinc-400 border-white/5"
            )}>
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                    Đăng nhập ngay
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;
