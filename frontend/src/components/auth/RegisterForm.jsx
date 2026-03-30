import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const RegisterForm = () => {
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
                <div className="bg-red-950/20 text-red-500 p-3 rounded-none flex items-start gap-2 text-sm border border-red-500/30">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errors.general}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                        Tên tài khoản
                    </Label>
                    <Input
                        name="username"
                        type="text"
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
                    <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                        Email
                    </Label>
                    <Input
                        name="email"
                        type="email"
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
                <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                    Họ và tên
                </Label>
                <Input
                    name="full_name"
                    type="text"
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
                <Label className="text-xs tracking-widest text-zinc-400 group-focus-within:text-primary transition-colors duration-300">
                    Số điện thoại
                </Label>
                <Input
                    name="phone"
                    type="tel"
                    icon={Phone}
                    placeholder="0987xxxxxx"
                    value={userData.phone}
                    onChange={handleChange}
                    error={errors.phone}
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

            <div className="text-center text-sm text-zinc-400 mt-2">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Đăng nhập ngay
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;
