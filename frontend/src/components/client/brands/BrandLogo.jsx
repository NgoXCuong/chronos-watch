import { useState } from 'react';

export default function BrandLogo({ brand }) {
    const [failed, setFailed] = useState(false);
    return brand.logo_url && !failed ? (
        <img src={brand.logo_url} alt={`Logo ${brand.name}`} loading="lazy" onError={() => setFailed(true)} className="brand-catalog-logo" />
    ) : <span className="brand-catalog-wordmark">{brand.name}</span>;
}
