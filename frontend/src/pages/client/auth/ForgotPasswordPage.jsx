import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Field } from '@/components/market/Field';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import authApi from '../../../api/auth.api';
import AuthShell from '../../../components/market/AuthShell';
import { AuthEyebrow, AuthSubtitle, AuthTitle } from '../../../components/market/AuthBrand';
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
        <AuthShell
            footer={
                <Link to="/login" className="font-semibold text-navy-600 hover:text-navy-800">
                    Quay lại đăng nhập
                </Link>
            }
            showcase={{
                image: loginImg,
                imageAlt: 'Bộ sưu tập đồng hồ Chronos',
                eyebrowIcon: Mail,
                eyebrow: 'Khôi phục',
                title: 'Thời gian không dừng lại — tài khoản của bạn cũng vậy.',
                quote: 'Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu. Liên kết chỉ có hiệu lực một lần để bảo vệ cỗ máy của bạn.',
                marks: ['Liên kết one-time', 'Hết hạn sau 15 phút', 'Không đổi mật khẩu cũ'],
            }}
        >
            {submitted ? (
                <div className="text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft">
                        <Mail size={28} strokeWidth={2} className="text-success" aria-hidden="true" />
                    </div>
                    <AuthTitle>Kiểm tra email của bạn</AuthTitle>
                    <AuthSubtitle>
                        Chúng tôi đã gửi liên kết khôi phục tới <strong className="text-foreground">{email}</strong>.
                        Vui lòng kiểm tra hộp thư đến hoặc thư rác.
                    </AuthSubtitle>
                    <Button variant="outline" size="full" className="mt-8" onClick={() => setSubmitted(false)}>
                        Gửi yêu cầu khác
                    </Button>
                </div>
            ) : (
                <>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-navy-600"
                    >
                        <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
                        Quay lại đăng nhập
                    </Link>
                    <div className="mt-6">
                        <AuthEyebrow accent="soft">Quên mật khẩu?</AuthEyebrow>
                        <div className="mt-4">
                            <AuthTitle>Lấy lại quyền truy cập</AuthTitle>
                            <AuthSubtitle>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</AuthSubtitle>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <Field
                            id="email"
                            label="Địa chỉ Email"
                            type="email"
                            icon={Mail}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                        <Button type="submit" variant="buy" size="full" loading={loading}>
                            <Send size={16} strokeWidth={2} aria-hidden="true" />
                            Gửi yêu cầu
                        </Button>
                    </form>
                </>
            )}
        </AuthShell>
    );
};

export default ForgotPasswordPage;
