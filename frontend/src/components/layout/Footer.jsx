import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 font-sans transition-colors duration-500">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                {/* Brand Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-2xl font-heading tracking-[0.5em] text-foreground mb-6 uppercase">CHRONOS</h2>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 max-w-sm italic">
                        "Nơi di sản nghệ thuật chế tác đồng hồ cao cấp hội tụ tinh hoa của thời gian."
                    </p>
                    <div className="flex gap-6">
                        <FaFacebookF size={18} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        <FaInstagram size={18} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        <FaTwitter size={18} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        <FaYoutube size={18} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Collections Links */}
                <div>
                    <h3 className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Bộ Sưu Tập</h3>
                    <ul className="space-y-4 text-left inline-block md:block mx-auto md:mx-0">
                        {['Timeless Classic', 'Modern Sport', 'Vintage Elite', 'Limited Edition'].map((item) => (
                            <li key={item}>
                                <Link to="#" className="text-muted-foreground text-xs uppercase tracking-widest hover:text-foreground transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Dịch Vụ Khách Hàng</h3>
                    <ul className="space-y-4 text-left inline-block md:block mx-auto md:mx-0">
                        {['Bảo Hành Cao Cấp', 'Đặt Lịch Tư Vấn', 'Chính Sách Vận Chuyển', 'Câu Hỏi Thường Gặp'].map((item) => (
                            <li key={item}>
                                <Link to="#" className="text-muted-foreground text-xs uppercase tracking-widest hover:text-foreground transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Liên Hệ</h3>
                    <ul className="space-y-6">
                        <li className="flex items-center gap-4 justify-center md:justify-start">
                            <MapPin size={16} className="text-primary/50" />
                            <span className="text-muted-foreground text-xs leading-relaxed uppercase tracking-wider">Trụ sở: 123 Luxury Ave, Hà Nội</span>
                        </li>
                        <li className="flex items-center gap-4 justify-center md:justify-start">
                            <Phone size={16} className="text-primary/50" />
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Hotline: 1800-CHRONOS</span>
                        </li>
                        <li className="flex items-center gap-4 justify-center md:justify-start">
                            <Mail size={16} className="text-primary/50" />
                            <span className="text-muted-foreground text-xs uppercase tracking-wider">Email: support@chronos.vn</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="container mx-auto px-6 border-t border-border pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-medium">
                <p>&copy; MMXXIV Chronos Prestige Group. All rights reserved.</p>
                <div className="flex gap-10">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
