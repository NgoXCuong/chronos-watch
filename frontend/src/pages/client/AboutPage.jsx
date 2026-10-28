import React, { useMemo } from 'react';

import AboutContact from '../../components/client/about/AboutContact';
import AboutHero from '../../components/client/about/AboutHero';
import AboutStory from '../../components/client/about/AboutStory';
import AboutValues from '../../components/client/about/AboutValues';
import { useBrandCatalog } from '../../hooks/useBrandCatalog';
import { countriesOf, totalProductsOf } from '../../utils/brandCatalog';

/**
 * Trang "Về chúng tôi": câu chuyện + nguyên tắc, số liệu ở hero đếm từ danh mục thật
 * (`/brands` kèm `product_count`) thay vì con số tự bịa như bản cũ.
 */
const AboutPage = () => {
    const { brands, loading } = useBrandCatalog();

    const stats = useMemo(
        () => ({ brandCount: brands.length, countryCount: countriesOf(brands).length, productCount: totalProductsOf(brands) }),
        [brands],
    );

    return (
        <div className="min-h-screen bg-background">
            <AboutHero stats={stats} loading={loading} />

            <div className="mx-auto w-full space-y-14 px-12 py-12 md:px-16 lg:space-y-20 lg:px-24 lg:py-16">
                <AboutStory />
                <AboutValues />
                <AboutContact />
            </div>
        </div>
    );
};

export default AboutPage;
