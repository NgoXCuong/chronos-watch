import React from 'react';
import Hero from '../../components/home/Hero';
import FeaturedCollections from '../../components/home/FeaturedCollections';

const HomePage = () => {
    return (
        <main className="bg-background overflow-hidden transition-colors duration-500">
            <Hero />
            
            {/* Story Section */}
            <section className="py-24 bg-accent/30 dark:bg-zinc-900/50 overflow-hidden font-sans border-y border-border">
                <div className="container mx-auto px-6 flex flex-col items-center text-center tracking-tight">
                    <span className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-6 block">Our Legacy</span>
                    <h2 className="text-4xl md:text-5xl font-heading text-foreground tracking-widest uppercase mb-10 drop-shadow-sm">
                        Thương Hiệu <br/><span className="italic font-light text-primary">Của Những Huyền Thoại</span>
                    </h2>
                    <div className="max-w-3xl">
                        <p className="text-muted-foreground text-lg font-light leading-relaxed italic mb-10">
                            "Từ những ngày đầu tiên, Chronos đã không ngừng theo đuổi sự hoàn mỹ. Mỗi chiếc đồng hồ không chỉ là một cỗ máy đếm giờ, mà là một tác phẩm nghệ thuật, một người bạn đồng hành trung thành qua nhiều thế hệ."
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-muted-foreground/60 text-[10px] uppercase tracking-[0.5em] font-medium opacity-80">
                            <span>Since 1924</span>
                            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            <span>Exclusivity</span>
                            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                            <span>Swiss Made</span>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedCollections />

            {/* CTA Section */}
            <section className="py-24 relative bg-background overflow-hidden font-sans border-t border-border">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-radial-at-c from-primary/10 via-transparent to-transparent"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-heading text-foreground tracking-[0.2em] mb-8 uppercase text-center">Khám Phá Thế Giới Chronos</h2>
                    <p className="text-muted-foreground font-light mb-12 max-w-xl text-center">Hãy để chúng tôi giúp bạn tìm thấy kiệt tác thời gian dành riêng cho chính mình.</p>
                    <button className="px-12 py-4 bg-transparent border border-primary/50 text-primary uppercase tracking-[0.2em] font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-500">
                        Đặt Lịch Tư Vấn Cao Cấp
                    </button>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
