import React from 'react';
import RegisterForm from '../../../components/auth/RegisterForm';
import { Watch } from 'lucide-react';
import registerImg from '../../../assets/register.webp';
import { cn } from '@/lib/utils';

const RegisterPage = () => {
    return (
        <div className="h-screen bg-zinc-50 flex flex-col md:flex-row overflow-hidden italic-fade-in font-sans">
            {/* Left Column: Luxury Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-10 bg-white relative order-2 md:order-1 overflow-y-auto h-full scrollbar-hide shadow-[10px_0_50px_rgba(0,0,0,0.03)] border-r border-zinc-100">
                {/* Subtle radial glow */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="max-w-md w-full relative z-10">
                    <div className="mb-6">
                        {/* Mobile Header */}
                        <div className="md:hidden flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-heading tracking-[0.4em] text-zinc-900 mb-2">CHRONOS</h1>
                            <div className="w-10 h-px bg-amber-500/50"></div>
                        </div>

                        <h3 className="text-3xl font-heading text-zinc-900 tracking-tight mb-2 uppercase tracking-[0.1em]">Gia Nhập</h3>
                        <p className="text-zinc-500 font-light tracking-wide">Bắt đầu hành trình cùng di sản thời gian.</p>
                    </div>

                    <RegisterForm variant="light" />
                </div>
            </div>

            {/* Right Column: Image (Prestige Background) */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden order-1 md:order-2 h-full">
                <img
                    src={registerImg}
                    alt="Luxury Watch Assembly"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105"
                />

                {/* Light Diffusion Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tl from-zinc-900/40 via-transparent to-white/10 mix-blend-multiply opacity-40"></div>
                <div className="absolute inset-0 bg-zinc-900/10"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-16 text-white z-10">
                    <div className="max-w-xl text-right ml-auto">
                        <span className="text-amber-400 text-xs uppercase tracking-[0.4em] mb-4 block font-medium font-heading">Fine Horology</span>
                        <h2 className="text-4xl lg:text-5xl font-heading leading-tight mb-6">Nơi những kiệt tác ra đời.</h2>
                        <div className="w-20 h-px bg-amber-500/30 mb-8 ml-auto"></div>
                        <p className="text-zinc-100 font-light italic text-lg leading-relaxed mb-12">
                            "Mỗi chi tiết nhỏ là sự kết tinh của hàng ngàn giờ lao động và niềm đam mê vô tận."
                        </p>

                        <div className="flex items-center gap-6 justify-end text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-medium">
                            <span>Exclusivity</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
                            <span>Quality</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
