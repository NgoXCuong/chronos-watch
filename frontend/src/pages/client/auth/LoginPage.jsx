import React from 'react';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '../../../components/auth/LoginForm';
import AuthShell from '../../../components/market/AuthShell';
import { AuthEyebrow, AuthSubtitle, AuthTitle } from '../../../components/market/AuthBrand';
import { Link } from 'react-router-dom';
import loginImg from '../../../assets/login.jpg';

const LoginPage = () => (
    <AuthShell
        showcase={{
            image: loginImg,
            imageAlt: 'Bộ sưu tập đồng hồ Chronos',
            eyebrowIcon: ShieldCheck,
            eyebrow: 'An toàn · Chính hãng',
            title: 'Đăng nhập để chốt đơn đúng giá gốc.',
            quote: 'Mỗi cỗ máy trong tủ của bạn đều có hồ sơ bảo hành và lịch sử đơn hàng riêng — đăng nhập để tra cứu chúng chỉ trong một nhịp.',
            marks: ['Chính hãng 100%', 'Bảo hành máy cơ', 'Đổi trả 7 ngày'],
        }}
        footer={
            <>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-semibold text-navy-600 hover:text-navy-800">
                    Đăng ký ngay
                </Link>
            </>
        }
    >
        <AuthEyebrow icon={ShieldCheck} accent="soft">Thành viên Chronos</AuthEyebrow>
        <div className="mt-4">
            <AuthTitle>Chào mừng trở lại</AuthTitle>
            <AuthSubtitle>Nhập thông tin để tiếp tục giỏ hàng của bạn.</AuthSubtitle>
        </div>

        <div className="mt-8">
            <LoginForm />
        </div>
    </AuthShell>
);

export default LoginPage;
