import React from 'react';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    ShieldCheck, 
    Gem, 
    Award, 
    History,
    ChevronRight,
    ArrowRight,
    Locate,
    Compass
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const AboutPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const coreValues = [
        {
            icon: ShieldCheck,
            title: "Chính Hãng 100%",
            desc: "Chronos cam kết mọi sản phẩm đều được nhập khẩu chính ngạch và kiểm định gắt gao bởi các chuyên gia hàng đầu."
        },
        {
            icon: Gem,
            title: "Đẳng Cấp Tuyệt Đối",
            desc: "Chúng tôi chỉ tuyển chọn những tuyệt tác tinh tế nhất, đại diện cho tinh hoa của ngành chế tác đồng hồ thế giới."
        },
        {
            icon: Award,
            title: "Đặc Quyền Thượng Lưu",
            desc: "Trải nghiệm dịch vụ cá nhân hóa, hậu mãi chuẩn 5 sao dành riêng cho cộng đồng sở hữu đồng hồ Chronos."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            
            {/* 1. HERO SECTION - ATMOSPHERIC LUXURY */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=2000" 
                        alt="Chronos Workshop" 
                        className="w-full h-full object-cover grayscale opacity-60 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950 dark:to-zinc-950"></div>
                    <div className="absolute inset-0 bg-zinc-950/30"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em] block mb-6 drop-shadow-lg">Heritage of Precision</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-medium text-white tracking-tight leading-none italic">
                        Di Sản <br /> <span className="text-amber-500">Thời Gian</span>
                    </h1>
                    <div className="h-px w-24 bg-amber-500 mx-auto mt-12 mb-8 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                    <p className="text-zinc-200 dark:text-zinc-400 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic drop-shadow-md">
                        "Chúng tôi không chỉ bán đồng hồ, chúng tôi lưu giữ những khoảnh khắc trường tồn của cuộc sống."
                    </p>
                </div>
            </section>

            {/* 2. BRAND STORY - SOPHISTICATED NARRATIVE */}
            <section className="py-32 px-6 bg-white dark:bg-zinc-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10 relative">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-zinc-900 dark:text-white leading-tight">
                                Câu Chuyện <span className="text-zinc-400 dark:text-zinc-600">Sáng Lập</span>
                            </h2>
                            <div className="h-0.5 w-16 bg-amber-500 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-6 text-zinc-500 dark:text-zinc-400 font-light leading-relaxed text-base md:text-lg">
                            <p>
                                Ra đời từ niềm đam mê mãnh liệt với những bánh răng và lo xo cơ khí phức tạp, **Chronos** đã hành trình xuyên qua các kinh đô đồng hồ Thụy Sĩ và Nhật Bản để tìm kiếm những giá trị đích thực.
                            </p>
                            <p>
                                Tại **Chronos**, mỗi chiếc đồng hồ không chỉ là một công cụ đo thời gian, mà là một tác phẩm nghệ thuật mang trong mình câu chuyện của những nghệ nhân chế tác bậc thầy. Chúng tôi cam kết bảo tồn tính toàn vẹn và di sản của từng thương hiệu mà mình đại diện.
                            </p>
                            <div className="pt-6 flex items-center gap-10">
                                <div className="text-center">
                                    <p className="text-3xl font-serif text-amber-600 font-medium">15+</p>
                                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Năm Kinh Nghiệm</p>
                                </div>
                                <div className="w-px h-12 bg-zinc-100 dark:bg-zinc-800"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-serif text-amber-600 font-medium">20+</p>
                                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Thương Hiệu Toàn Cầu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[3rem] overflow-hidden rotate-2 group-hover:rotate-0 transition-all duration-1000 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" alt="Detail" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                        </div>
                        <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-amber-600 rounded-[2.5rem] p-8 flex flex-col justify-end text-white shadow-2xl -rotate-6 group-hover:rotate-0 transition-all duration-700">
                             <History size={32} className="mb-4" />
                             <p className="text-xs font-black uppercase tracking-widest">Since 2010</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CORE VALUES - MINIMALIST CARDS */}
            <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Why Chronos</span>
                        <h2 className="text-4xl font-serif font-medium text-zinc-900 dark:text-white">Giá Trị Của Sự Trường Tồn</h2>
                        <div className="h-px w-24 bg-amber-500/30 mx-auto mt-8"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {coreValues.map((val, idx) => (
                            <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 group">
                                <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/5 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                    <val.icon size={30} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">{val.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm leading-relaxed italic">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. LOCATION & CONTACT - INTEGRATED MAP */}
            <section className="py-32 px-6 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* Address Details */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Visit Showroom</span>
                                <h2 className="text-5xl font-serif font-medium text-zinc-900 dark:text-white">Điểm Đến Của <br /> <span className="italic">Những Tâm Hồn Đặc Quyền</span></h2>
                            </div>

                            <div className="space-y-10">
                                <div className="flex gap-8 group">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic group-hover:text-amber-500 transition-colors">Địa chỉ trụ sở</p>
                                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">18 Hàng Khay, Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
                                    </div>
                                </div>

                                <div className="flex gap-8 group">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                        <Phone size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic group-hover:text-amber-500 transition-colors">Đường dây nóng</p>
                                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">1900 8888 66</p>
                                    </div>
                                </div>

                                <div className="flex gap-8 group">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                        <Mail size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic group-hover:text-amber-500 transition-colors">Thư điện tử</p>
                                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 tracking-tight lowercase underline underline-offset-4">concierge@chronos.luxury</p>
                                    </div>
                                </div>

                                <div className="flex gap-8 group">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                        <Clock size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic group-hover:text-amber-500 transition-colors">Giờ tiếp đón</p>
                                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">Mon - Sun: 09:00 AM - 09:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAP EMBED */}
                        <div className="lg:col-span-7 h-[600px] rounded-[3rem] overflow-hidden border-8 border-zinc-50 dark:border-zinc-900 shadow-2xl relative group">
                            <iframe 
                                title="Chronos Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.089843657386!2d105.8507856!3d21.0286669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9532657d97%3A0xe5435f212f459ba4!2s18%20H%C3%A0ng%20Khay%2C%20Tr%C3%A0ng%20Ti%E1%BB%81n%2C%20Ho%C3%A0n%20Ki%E1%BA%BFm%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2s!4v1712243122171!5m2!1svi!2s" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg)' : 'none' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="transition-all duration-700 group-hover:scale-110"
                            ></iframe>
                            
                            <div className="absolute top-8 left-8 p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl pointer-events-none group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-700 group-hover:-translate-y-2">
                                <div className="flex items-center gap-3">
                                    <Locate size={16} className={isDark ? "text-amber-500" : "text-amber-600 group-hover:text-white"} />
                                    <p className={cn("text-[10px] font-black uppercase tracking-widest", isDark ? "text-white" : "text-zinc-900 group-hover:text-white")}>Tâm Điểm Thủ Đô</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CURATED FOOTER - CTA */}
            <section className="max-w-7xl mx-auto pb-32 px-6">
                <div className="rounded-[4rem] bg-zinc-900 dark:bg-zinc-100 p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
                    {/* Background decorative elements */}
                    <Compass size={400} className="absolute -top-20 -left-20 text-white/5 dark:text-zinc-900/5 rotate-12 transition-transform duration-[20s] linear animate-spin-slow" />
                    
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-serif font-medium text-white dark:text-zinc-900 tracking-tight italic">Sở Hữu <span className="text-amber-500">Dấu Ấn</span> Của Riêng Bạn</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 font-light max-w-xl mx-auto text-lg leading-relaxed">
                            Mời bạn ghé thăm showroom để trải nghiệm thực tế sự tinh xảo trong từng đường nét của các tuyệt tác đồng hồ.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-center gap-6 pt-8">
                        <button className="h-14 px-12 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-500/20 group-hover:scale-105">
                            Liên Hệ Ngay
                        </button>
                        <button className="h-14 w-14 rounded-full border border-white/20 dark:border-zinc-200 flex items-center justify-center text-white dark:text-zinc-900 hover:bg-white hover:text-zinc-950 transition-all">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
