import React from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ShieldCheck,
    Gem,
    Award,
    ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import herobanner from '../../assets/hero-banner-sp.avif'

const AboutPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const coreValues = [
        {
            icon: ShieldCheck,
            title: "Chính Hãng",
            subtitle: "Đảm bảo tuyệt đối",
            desc: "Mọi cỗ máy thời gian đều được nhập khẩu chính ngạch, trải qua quy trình kiểm định gắt gao bởi các chuyên gia hàng đầu."
        },
        {
            icon: Gem,
            title: "Tuyệt Tác",
            subtitle: "Lựa chọn khắt khe",
            desc: "Chúng tôi chỉ tuyển chọn những cỗ máy tinh tế nhất, đại diện cho đỉnh cao nghệ thuật chế tác vi cơ học thế giới."
        },
        {
            icon: Award,
            title: "Đặc Quyền",
            subtitle: "Hậu mãi 5 sao",
            desc: "Trải nghiệm dịch vụ chăm sóc cá nhân hóa, bảo dưỡng chuẩn Thụy Sĩ dành riêng cho chủ nhân đồng hồ Chronos."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 selection:bg-amber-500/30 font-sans">

            {/* 1. HERO SECTION - EDITORIAL TYPOGRAPHY */}
            <section className="relative pt-6 pb-6 px-6 flex flex-col items-center justify-center text-center border-b border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase">
                        The Chronos Story
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl   dark:text-white leading-[1.1]">
                        Di Sản <br />
                        <span className="italic   dark:text-zinc-700">Thời Gian</span>
                    </h1>
                    <div className="w-px h-6 bg-gradient-to-b from-amber-500 to-transparent mx-auto mt-2 mb-2"></div>
                    <p className="text-zinc-700 dark:  text-md max-w-2xl mx-auto leading-relaxed">
                        Không chỉ đo lường từng giây phút, chúng tôi lưu giữ và tôn vinh những giá trị trường tồn của nghệ thuật chế tác cơ khí.
                    </p>
                </div>
            </section>

            {/* 2. BRAND STORY - EDITORIAL LAYOUT */}
            <section className="py-12 px-6 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 md:gap-24 items-center">
                    {/* Image Column */}
                    <div className="md:col-span-5 relative group">
                        <div className="aspect-[6/7] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-sm">
                            <img
                                src={herobanner}
                                alt="Watchmaking detailed craftsmanship"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                        {/* Detail accent */}
                        <div className="absolute -bottom-6 -right-6 md:-left-6 md:right-auto bg-zinc-900 dark:bg-zinc-100 text-white dark: p-8 flex flex-col justify-center min-w-[200px] shadow-xl">
                            <p className="text-4xl  mb-2">15<span className="text-amber-500 text-2xl">+</span></p>
                            <p className="text-[10px]  uppercase font-semibold  dark:text-zinc-700">Năm Tận Tâm</p>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="md:col-span-7 space-y-10 md:pl-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl   dark:text-white leading-tight">
                                Khởi nguồn <br />
                                <span className="italic ">của sự hoàn mỹ</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-zinc-600 dark:  leading-relaxed text-base md:text-lg">
                            <p>
                                Ra đời từ niềm đam mê mãnh liệt với những bánh răng và lò xo cơ khí phức tạp, <strong className="font-medium  dark:text-zinc-200">Chronos</strong> đã bắt đầu cuộc hành trình xuyên qua các kinh đô đồng hồ Thụy Sĩ và Đức để tìm kiếm những giá trị đích thực nhất.
                            </p>
                            <p>
                                Tại Chronos, mỗi cỗ máy không chỉ là một công cụ chỉ báo thời gian, mà là một tác phẩm nghệ thuật thu nhỏ mang trong mình linh hồn và câu chuyện của những nghệ nhân bậc thầy. Chúng tôi cam kết bảo tồn tính nguyên bản và di sản của hơn 20 thương hiệu danh giá mà mình đại diện.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CORE VALUES - MINIMALIST GRIDS */}
            <section className="py-12 px-6 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200/50 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase block mb-4">
                            Triết lý hoạt động
                        </span>
                        <h2 className="text-3xl md:text-4xl   dark:text-white">Giá trị <span className="italic ">cốt lõi</span></h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {coreValues.map((val, idx) => (
                            <div key={idx} className="group border-t border-zinc-200 dark:border-zinc-800 pt-6">

                                {/* Box chứa Title, Subtitle và Icon */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="pr-4">
                                        <h3 className="text-xl   dark:text-white mb-1">{val.title}</h3>
                                        <p className="text-[10px]  uppercase text-amber-600 dark:text-amber-500">{val.subtitle}</p>
                                    </div>
                                    <div className="text-zinc-300 dark:text-zinc-700 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-500 shrink-0">
                                        <val.icon size={32} strokeWidth={1} />
                                    </div>
                                </div>

                                <p className="text-zinc-700 dark:  text-sm leading-relaxed">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. LOCATION & CONTACT - CLEAN & STRUCTURED */}
            <section className="py-12 px-6 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Details */}
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-semibold  text-amber-600 dark:text-amber-500 uppercase block mb-2">
                                    Điểm đến
                                </span>
                                <h2 className="text-4xl md:text-5xl   dark:text-white leading-tight">
                                    Cửa hàng <br />
                                    <span className="italic ">Chronos</span>
                                </h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <MapPin size={18} />
                                        <h4 className="text-xs font-semibold  uppercase  dark:text-zinc-100">Địa chỉ</h4>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:  leading-relaxed">
                                        Phan Tây Nhạc, Xuân Phương<br />
                                        Quận Nam Từ Liêm, Hà Nội
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <Clock size={18} />
                                        <h4 className="text-xs font-semibold  uppercase  dark:text-zinc-100">Giờ mở cửa</h4>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:  leading-relaxed">
                                        Thứ Hai - Chủ Nhật<br />
                                        09:00 AM - 09:00 PM
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <Phone size={18} />
                                        <h4 className="text-xs font-semibold  uppercase  dark:text-zinc-100">Hotline</h4>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:  leading-relaxed">
                                        1900 8888 66
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <Mail size={18} />
                                        <h4 className="text-xs font-semibold  uppercase  dark:text-zinc-100">Email</h4>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:  leading-relaxed">
                                        contact@chronos.vn
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MAP EMBED */}
                        <div className="h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-700">
                            <iframe
                                title="Chronos Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12493.871626617116!2d105.74130181445118!3d21.037757535179942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135096b31fa7abb%3A0xff645782804911af!2zVHLGsOG7nW5nIMSR4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgxJDDtG5nIMOB!5e1!3m2!1svi!2s!4v1775375183300!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURATED FOOTER - MINIMAL CTA */}
            <section className="py-12 px-6 border-t border-zinc-200/50 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl   dark:text-white leading-tight">
                        Trải nghiệm <span className="italic ">Tuyệt tác</span>
                    </h2>
                    <p className="text-zinc-800  text-base leading-relaxed">
                        Mời quý khách ghé thăm không gian nghệ thuật của chúng tôi để tự mình cảm nhận độ tinh xảo trong từng cỗ máy thời gian.
                    </p>

                    <button className="group inline-flex items-center gap-4 bg-zinc-900 dark:bg-white text-white dark: px-8 py-4 rounded-full text-xs font-semibold  uppercase hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-colors duration-300">
                        Liên hệ tư vấn
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;