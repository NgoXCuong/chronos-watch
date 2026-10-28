import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import RegisterForm from '../../../components/auth/RegisterForm';
import AuthShell from '../../../components/market/AuthShell';
import { AuthEyebrow, AuthSubtitle, AuthTitle } from '../../../components/market/AuthBrand';
import registerImg from '../../../assets/register.webp';

const RegisterPage = () => (
    <AuthShell
        reverse
        showcase={{
            image: registerImg,
            imageAlt: 'Nghệ nhân lắp ráp đồng hồ cơ',
            eyebrowIcon: Award,
            eyebrow: 'Fine Horology',
            title: 'Nơi những cỗ máy có chủ nhân.',
            quote: 'Một tài khoản Chronos theo bạn suốt vòng đời chiếc đồng hồ: hóa đơn, bảo hành, phụ kiện thay thế và ưu đãi riêng cho từng thương hiệu bạn theo dõi.',
            marks: ['Tài khoản miễn phí', 'Theo dõi bảo hành', 'Ưu đãi thành viên'],
        }}
        footer={
            <>
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-semibold text-navy-600 hover:text-navy-800">
                    Đăng nhập ngay
                </Link>
            </>
        }
    >
        <AuthEyebrow icon={Award} accent="soft">Gia nhập</AuthEyebrow>
        <div className="mt-4">
            <AuthTitle>Tạo tài khoản Chronos</AuthTitle>
            <AuthSubtitle>Chỉ mất khoảng một phút để bắt đầu hành trình cùng di sản thời gian.</AuthSubtitle>
        </div>

        <div className="mt-8">
            <RegisterForm />
        </div>
    </AuthShell>
);

export default RegisterPage;
