import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) setSubmitted(true);
    };

    return (
        <section className={`relative border-t transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#060606] border-white/5' : 'bg-stone-100 border-stone-200'}`}>
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl ${isDark ? 'bg-amber-500/[0.03]' : 'bg-amber-500/[0.05]'}`}></div>
            </div>

            <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 py-5 md:py-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Label */}
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-6 h-px bg-amber-500/40"></div>
                        <p className="text-sm text-amber-500 uppercase">Thành Viên VIP</p>
                        <div className="w-6 h-px bg-amber-500/40"></div>
                    </div>

                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-stone-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                        Gia Nhập Giới<br /><span className="text-amber-500">Tinh Hoa</span>
                    </h2>
                    <p className={`text-sm md:text-base leading-relaxed mb-4 max-w-lg mx-auto ${isDark ? 'text-zinc-500' : 'text-stone-600'}`}>
                        Đăng ký để nhận thông tin về bộ sưu tập mới, ưu đãi độc quyền và những câu chuyện đằng sau từng tuyệt tác đồng hồ.
                    </p>

                    {submitted ? (
                        <div className="flex flex-col items-center gap-3 py-3">
                            <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center mb-2">
                                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>Cảm ơn bạn đã đăng ký!</p>
                            <p className={isDark ? 'text-zinc-500' : 'text-stone-500'}>Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-0">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email..."
                                required
                                className={`flex-1 border focus:border-amber-500/50 px-5 py-4 text-sm outline-none transition-all duration-300 ${isDark
                                    ? 'bg-white/5 border-white/10 text-white placeholder:text-zinc-600'
                                    : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400'}`}
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold uppercase transition-all duration-300 whitespace-nowrap"
                            >
                                Đăng Ký
                            </button>
                        </form>
                    )}

                    <p className={`text-[10px]  uppercase mt-6 ${isDark ? 'text-zinc-700' : 'text-stone-400'}`}>
                        Không spam · Hủy bất kỳ lúc nào · Dữ liệu bảo mật
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
