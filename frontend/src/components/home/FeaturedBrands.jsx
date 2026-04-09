import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import brandApi from '../../api/brand.api';

const FeaturedBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        brandApi.getAll()
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.data || []);
                setBrands(items.filter(b => b.isActive !== false));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const displayBrands = brands.length > 0 ? brands.slice(0, 8) : [];

    if (displayBrands.length === 0 && !loading) return null;

    return (
        <div className={`relative border-y transition-all duration-700 ${isDark
            ? 'bg-zinc-950 border-white/5 shadow-[0_-1px_20px_-10px_rgba(0,0,0,0.5)]'
            : 'bg-zinc-50/30 border-zinc-100 shadow-[0_1px_10px_-5px_rgba(0,0,0,0.05)]'
            }`}>
            <div className="max-w-[1400px] mx-auto px-4 md:px-0 flex items-center">
                {/* Side Label */}
                <div className={`hidden md:flex flex-col items-center justify-center px-8 border-r h-16 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                    <span className={`text-[12px] uppercase font-bold transform -rotate-180 [writing-mode:vertical-lr] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        Partners
                    </span>
                </div>

                {/* Marquee with Masking */}
                <div className="flex-1 py-6 md:py-8 overflow-hidden relative"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                    <div className="flex gap-10 md:gap-16 items-center whitespace-nowrap animate-marquee">
                        {[...displayBrands, ...displayBrands, ...displayBrands].map((brand, i) => (
                            <Link
                                key={i}
                                to={`/products?brand=${brand.slug || brand._id}`}
                                className="flex items-center gap-10 md:gap-16 group perspective-1000"
                            >
                                {/* Wrapper gom logo và tên thương hiệu sát nhau */}
                                <div className="flex items-center gap-2.5 md:gap-3">
                                    {brand.logo_url && (
                                        <img src={brand.logo_url} alt={brand.name}
                                            className={`h-5 md:h-6 object-contain transition-transform duration-700 transform group-hover:scale-110 ${isDark ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : ''}`} />
                                    )}
                                    <span className={`text-[14px] md:text-md font-bold uppercase transition-transform duration-700 group-hover:scale-105 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                                        {brand.name}
                                    </span>
                                </div>
                                {/* Dấu chấm phân cách */}
                                <span className="h-6 w-[2px] bg-amber-500 mx-2"></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-33.333%); }
                }
                .animate-marquee { animation: marquee 40s linear infinite; }
                .animate-marquee:hover { animation-play-state: paused; }
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </div>
    );
};

export default FeaturedBrands;