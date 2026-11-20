import React, { useMemo } from 'react';

import AboutContact from '../../components/client/about/AboutContact';
import AboutHero from '../../components/client/about/AboutHero';
import AboutStory from '../../components/client/about/AboutStory';
import AboutValues from '../../components/client/about/AboutValues';
import { useBrandCatalog } from '../../hooks/useBrandCatalog';
import { countriesOf, totalProductsOf } from '../../utils/brandCatalog';
import '../../styles/storefront-pages.css';
import '../../styles/about-page.css';

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
        <main className="atelier-shell about-page">
            <AboutHero stats={stats} loading={loading} />

            <div className="about-content">
                <AboutStory />
                <AboutValues />
                <AboutContact />
            </div>
        </main>
    );
};

export default AboutPage;
