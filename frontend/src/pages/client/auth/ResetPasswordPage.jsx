import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import authApi from '../../../api/auth.api';
import AuthShell from '../../../components/market/AuthShell';
import { PasswordField } from '@/components/market/Field';
import { AuthEyebrow, AuthSubtitle, AuthTitle } from '../../../components/market/AuthBrand';
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
        <AuthShell
            footer={
                <Link to="/login" className="font-semibold text-navy-600 hover:text-navy-800">
                    Đăng nhập ngay
                </Link>
            }
            showcase={{
                image: loginImg,
                imageAlt: 'Bộ sưu tập đồng hồ Chronos',
                eyebrowIcon: Lock,
                eyebrow: 'Security & Privacy',
                title: 'Thiết lập lại bảo mật cho cỗ máy của bạn.',
                quote: 'Sự an tâm của bạn là ưu tiên hàng đầu trong mỗi nhịp đập. Mật khẩu mới sẽ có hiệu lực ngay với mọi phiên đăng nhập hiện tại.',
                marks: ['Mã hóa bcrypt', 'Hủy phiên cũ', 'Tối thiểu 6 ký tự'],
            }}
        >
            {isSuccess ? (
                <div className="text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft">
                        <CheckCircle2 size={28} strokeWidth={2} className="text-success" aria-hidden="true" />
                    </div>
                    <AuthTitle>Đã cập nhật mật khẩu</AuthTitle>
                    <AuthSubtitle>
                        Bạn sẽ được đưa về trang đăng nhập trong giây lát.
                    </AuthSubtitle>
                </div>
            ) : (
                <>
                    <AuthEyebrow icon={Lock} accent="soft">Đặt lại mật khẩu</AuthEyebrow>
                    <div className="mt-4">
                        <AuthTitle>Mật khẩu mới</AuthTitle>
                        <AuthSubtitle>Chọn mật khẩu đủ mạnh cho tài khoản của bạn.</AuthSubtitle>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <PasswordField
                            id="newPassword"
                            label="Mật khẩu mới"
                            icon={Lock}
                            placeholder="••••••••"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            show={showPassword}
                            onToggle={() => setShowPassword(prev => !prev)}
                            autoComplete="new-password"
                            required
                        />
                        <PasswordField
                            id="confirmPassword"
                            label="Xác nhận mật khẩu"
                            icon={Lock}
                            placeholder="••••••••"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            show={showPassword}
                            onToggle={() => setShowPassword(prev => !prev)}
                            autoComplete="new-password"
                            required
                        />
                        <Button type="submit" variant="buy" size="full" loading={loading}>
                            <Lock size={16} strokeWidth={2} aria-hidden="true" />
                            Cập nhật mật khẩu
                        </Button>
                    </form>
                </>
            )}
        </AuthShell>
    );
};

export default ResetPasswordPage;
