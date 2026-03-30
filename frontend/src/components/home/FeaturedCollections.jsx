import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const collections = [
    {
        title: "Classic Timeless",
        subtitle: "Di Sản Truyền Thống",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop",
        link: "#",
    },
    {
        title: "Modern Sport",
        subtitle: "Động Lực & Sức Mạnh",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop",
        link: "#",
    },
    {
        title: "Vintage Elite",
        subtitle: "Vẻ Đẹp Hoài Cổ",
        image: "https://images.unsplash.com/photo-1508685096489-7a689bdca028?q=80&w=1000&auto=format&fit=crop",
        link: "#",
    }
];

const FeaturedCollections = () => {
    return (
        <section className="py-24 bg-background font-sans transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl text-left">
                        <span className="text-primary text-xs tracking-[0.4em] uppercase font-semibold mb-4 block">Our Collections</span>
                        <h2 className="text-4xl md:text-5xl font-heading text-foreground tracking-widest uppercase mb-6 drop-shadow-sm">
                            Dấu Ấn <br/><span className="italic font-light text-primary">Tuyệt Tác</span>
                        </h2>
                        <div className="w-16 h-px bg-primary/30 mb-6"></div>
                        <p className="text-muted-foreground font-light leading-relaxed">
                            Mỗi bộ sưu tập là một câu chuyện riêng biệt, được thiết kế để tôn vinh sự tinh tế và cái tôi độc bản của người sở hữu.
                        </p>
                    </div>
                    <Button variant="outline" size="lg" className="px-10 group bg-background/50 backdrop-blur-sm">
                        Xem Tất Cả <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.map((col, idx) => (
                        <div key={idx} className="group relative h-[500px] overflow-hidden cursor-pointer shadow-2xl">
                            {/* Overlay Background */}
                            <div className="absolute inset-0 z-0 scale-100 group-hover:scale-110 transition-transform duration-[2000ms]">
                                <img 
                                    src={col.image} 
                                    alt={col.title}
                                    className="w-full h-full object-cover brightness-50 contrast-[1.1]"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                                <span className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Exclusive</span>
                                <h3 className="text-2xl font-heading text-white tracking-widest uppercase mb-2 shadow-sm">{col.title}</h3>
                                <p className="text-zinc-300 text-xs font-light italic mb-6 tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform">{col.subtitle}</p>
                                <div className="w-0 h-px bg-primary group-hover:w-full transition-all duration-700"></div>
                            </div>

                            {/* Border Highlight */}
                            <div className="absolute inset-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollections;
