import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Field, PasswordField } from '@/components/market/Field';

const initialUser = { username: '', email: '', password: '', full_name: '', phone: '' };

const validate = (userData) => {
    const errors = {};
    if (!userData.username) errors.username = 'Tên tài khoản là bắt buộc';
    if (!userData.email) errors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Email không hợp lệ';
    if (!userData.password) errors.password = 'Mật khẩu là bắt buộc';
    else if (userData.password.length < 6) errors.password = 'Mật khẩu phải từ 6 ký tự';
    if (!userData.full_name) errors.full_name = 'Họ tên là bắt buộc';
    return errors;
};

const RegisterForm = () => {
    const [userData, setUserData] = useState(initialUser);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(userData);
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
        <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
                <p className="rounded-md bg-sale-soft px-3 py-2 text-sm text-sale">{errors.general}</p>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                    id="username"
                    label="Tên tài khoản"
                    icon={User}
                    placeholder="Username của bạn"
                    value={userData.username}
                    onChange={handleChange}
                    error={errors.username}
                    autoComplete="username"
                    required
                />
                <Field
                    id="email"
                    label="Email"
                    type="email"
                    icon={Mail}
                    placeholder="you@example.com"
                    value={userData.email}
                    onChange={handleChange}
                    error={errors.email}
                    autoComplete="email"
                    required
                />
            </div>

            <Field
                id="full_name"
                label="Họ và tên"
                icon={User}
                placeholder="Nguyễn Văn A"
                value={userData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                autoComplete="name"
                required
            />

            <Field
                id="phone"
                label="Số điện thoại"
                type="tel"
                icon={Phone}
                placeholder="0987xxxxxx"
                value={userData.phone}
                onChange={handleChange}
                error={errors.phone}
                autoComplete="tel"
            />

            <PasswordField
                id="password"
                label="Mật khẩu"
                icon={Lock}
                placeholder="Tối thiểu 6 ký tự"
                value={userData.password}
                onChange={handleChange}
                error={errors.password}
                show={showPassword}
                onToggle={() => setShowPassword(prev => !prev)}
                autoComplete="new-password"
                required
            />

            <Button type="submit" variant="buy" size="full" loading={loading}>
                <UserPlus size={16} strokeWidth={2} aria-hidden="true" />
                Đăng Ký Tài Khoản
            </Button>
        </form>
    );
};

export default RegisterForm;
