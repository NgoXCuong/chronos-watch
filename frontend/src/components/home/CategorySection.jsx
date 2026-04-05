import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import categoryApi from '../../api/category.api';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        categoryApi.getAll()
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.data || []);
                setCategories(items.filter(c => c.isActive !== false));
            })
            .catch(() => { });
    }, []);

    const categoryImages = {
        'nam': 'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1000&auto=format&fit=crop',
        'nu': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
        'automatic': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
        'smartwatch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop',
        'classic': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop',
        'luxury': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop',
    };

    const fallbackImages = [
        'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000',
        'https://images.unsplash.com/photo-1526045431048-f857369aba09?q=80&w=1000',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000',
    ];

    const displayCategories = categories.length > 0
        ? categories.slice(0, 4).map((c, index) => {
            const slug = c.slug?.toLowerCase() || '';
            const name = c.name?.toLowerCase() || '';

            // Tìm ảnh phù hợp theo slug hoặc name
            let assignedImage = c.imageUrl || c.image_url || c.image;

            if (!assignedImage) {
                if (slug.includes('nam') || name.includes('nam')) assignedImage = categoryImages['nam'];
                else if (slug.includes('nu') || name.includes('nu')) assignedImage = categoryImages['nu'];
                else if (slug.includes('auto') || name.includes('cơ')) assignedImage = categoryImages['automatic'];
                else if (slug.includes('smart') || name.includes('thông minh')) assignedImage = categoryImages['smartwatch'];
                else assignedImage = fallbackImages[index % fallbackImages.length];
            }

            return {
                ...c,
                desc: c.description || 'Khám phá bộ sưu tập',
                imageUrl: assignedImage,
            };
        })
        : [];

    if (displayCategories.length === 0) return null; // Hide if no real data in DB

    return (
        <section>
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-base text-amber-500 uppercase mb-2">Danh Mục</p>
                    <h2 className={`text-3xl md:text-4xl font-bold transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}
                        style={{ fontFamily: 'Georgia, serif' }}>
                        Bộ Sưu Tập
                    </h2>
                </div>
                <Link to="/products" className={`hidden sm:flex items-center gap-2 text-[11px] uppercase font-semibold transition-colors group ${isDark ? 'text-zinc-500 hover:text-amber-400' : 'text-zinc-400 hover:text-amber-600'}`}>
                    Xem tất cả
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {displayCategories.map((cat, i) => (
                    <Link
                        key={cat._id}
                        to={`/products?category=${cat.slug || cat._id}`}
                        className="group relative overflow-hidden bg-zinc-200 dark:bg-zinc-900"
                        style={{ aspectRatio: '3/4' }}
                    >
                        <img
                            src={cat.imageUrl || 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000'}
                            alt={cat.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                            style={{ filter: isDark ? 'brightness(0.45)' : 'brightness(0.5)' }}
                        />
                        {/* Hover corner decoration */}
                        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-500/0 group-hover:border-amber-500/60 transition-all duration-500 z-10"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-amber-500/0 group-hover:border-amber-500/60 transition-all duration-500 z-10"></div>

                        {/* Number */}
                        <div className="absolute top-4 left-5 text-base  text-white/80 font-mono z-10">
                            {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* Content overlay */}
                        <div className={`absolute inset-0 flex flex-col justify-end p-5 transition-all duration-500 z-10 ${isDark
                            ? 'bg-gradient-to-t from-black/70 via-black/10 to-transparent'
                            : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'}`}>
                            <p className="text-sm  text-amber-400/0 group-hover:text-amber-400/80 mb-1.5 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                {cat.desc}
                            </p>
                            <h3 className="text-white text-lg md:text-xl font-bold uppercase">
                                {cat.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-white/70 group-hover:text-amber-400/70 transition-colors duration-500 uppercase">
                                Khám phá <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
