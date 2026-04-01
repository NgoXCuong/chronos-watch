import React from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import loginImg from '../../../assets/login.jpg';
import { cn } from '@/lib/utils';

const LoginPage = () => {
    return (
        <div className="h-screen bg-zinc-50 flex flex-col md:flex-row overflow-hidden italic-fade-in font-sans">
            {/* Left Column: Image (Prestige Background) */}
            <div className="hidden md:flex md:w-3/5 relative overflow-hidden h-full">
                <img
                    src={loginImg}
                    alt="Luxury Watch Collection"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-110"
                />

                {/* Light Diffusion Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/40 via-transparent to-white/10 mix-blend-multiply opacity-40"></div>
                <div className="absolute inset-0 bg-zinc-900/10"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-16 text-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-px h-12 bg-amber-500/50"></div>
                        <h1 className="text-4xl font-heading tracking-[0.3em] font-light text-white">CHRONOS</h1>
                    </div>

                    <div className="max-w-xl">
                        <span className="text-amber-400 text-xs uppercase tracking-[0.5em] mb-4 block font-medium font-heading">Legacy & Prestige</span>
                        <h2 className="text-5xl lg:text-6xl font-heading leading-tight mb-6">Nghi thức của sự thanh lịch.</h2>
                        <div className="w-20 h-px bg-amber-500/30 mb-6"></div>
                        <p className="text-zinc-100 font-light italic text-xl leading-relaxed">
                            "Mỗi nhịp đập của cỗ máy là một chương trong cuốn hồi ký của thời gian. Hãy để Chronos ghi dấu ấn phong cách độc bản cho chính bạn."
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] text-zinc-300 font-medium">
                        <span>Heritage</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Craftsmanship</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>Innovation</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Luxury Form */}
            <div className="w-full md:w-2/5 flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-y-auto h-full scrollbar-hide shadow-[-10px_0_50px_rgba(0,0,0,0.03)] border-l border-zinc-100">
                {/* Subtle radial glow */}
                <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="max-w-sm w-full relative z-10">
                    <div className="mb-16">
                        {/* Mobile Header */}
                        <div className="md:hidden flex flex-col items-center mb-10">
                            <h1 className="text-3xl font-heading tracking-[0.4em] text-zinc-900 mb-2">CHRONOS</h1>
                            <div className="w-10 h-px bg-amber-500/50"></div>
                        </div>

                        <h3 className="text-4xl font-heading text-zinc-900 tracking-tight mb-3">Chào Mừng</h3>
                        <p className="text-zinc-500 font-light tracking-wide">Đăng nhập vào không gian dành cho giới mộ điệu.</p>
                    </div>

                    <LoginForm variant="light" />

                    <div className="mt-12 border-t border-zinc-100 pt-6 text-[10px] text-center tracking-[0.3em] text-zinc-400 font-heading uppercase">
                        &copy; MMXXIV Chronos Prestige Group
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
