import React from 'react';
import HeroBanner from '../../../components/home/HeroBanner';
import FeaturedBrands from '../../../components/home/FeaturedBrands';
import CategorySection from '../../../components/home/CategorySection';
import FeaturedProducts from '../../../components/home/FeaturedProducts';
import Newsletter from '../../../components/home/Newsletter';
import { useTheme } from '../../../context/ThemeContext';

const HomePage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            {/* Hero Banner — full screen, sits under fixed header */}
            <HeroBanner />

            {/* Brands strip */}
            <FeaturedBrands />

            {/* Categories & Products */}
            <div className={`transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-zinc-50/50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                    <CategorySection />
                    <FeaturedProducts />
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />
        </div>
    );
};

export default HomePage;
