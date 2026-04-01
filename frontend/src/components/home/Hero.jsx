import React from 'react';
import { Button } from "@/components/ui/button";
import heroImg from '../../assets/logo.jpg';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '@/lib/utils';

const Hero = () => {
    const { theme } = useTheme();

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center font-sans transition-colors duration-500">
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImg}
                    alt="Luxury Watch Background"
                    className={cn(
                        "w-full h-full object-cover transition-all duration-[10000ms] hover:scale-110",
                        theme === 'light' ? "grayscale-[0.2] brightness-90" : "grayscale brightness-[0.3]"
                    )}
                />
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    theme === 'light' ? "bg-white/40" : "bg-gradient-to-b from-black/60 via-transparent to-black"
                )}></div>
                <div className={cn(
                    "absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t transition-all duration-500",
                    theme === 'light' ? "from-background via-background/20 to-transparent" : "from-background via-background/50 to-transparent"
                )}></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mb-6 flex flex-col items-center">
                    <span className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 block">Heriage & Excellence</span>
                    <div className="w-12 h-px bg-primary/30"></div>
                </div>

                <h1 className={cn(
                    "text-5xl md:text-7xl lg:text-8xl font-heading tracking-widest uppercase mb-6 leading-tight drop-shadow-2xl transition-colors duration-500",
                    theme === 'light' ? "text-foreground" : "text-white"
                )}>
                    Đẳng Cấp <br /> <span className="text-primary italic font-light tracking-normal lowercase">vượt</span> Thời Gian
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed italic">
                    "Khám phá di sản nghệ thuật chế tác đồng hồ cao cấp từ những nghệ nhân bậc thầy."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button variant="primary" size="lg" className="px-12 group">
                        Khám Phá Ngay
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg" className="px-12 bg-background/50 backdrop-blur-sm">
                        Câu Chuyện Thương Hiệu
                    </Button>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground">Scroll Down</span>
                    <div className="w-[1px] h-12 bg-foreground/30"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
