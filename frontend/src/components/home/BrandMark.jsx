import { useState } from "react";

export default function BrandMark({ brand }) {
  const [failed, setFailed] = useState(false);
  return <>
    <span className="brand-logo-box">{brand.logo_url && !failed
      ? <img src={brand.logo_url} alt={brand.name} loading="lazy" onError={() => setFailed(true)} />
      : <span className="brand-logo-fallback">{brand.name}</span>}
    </span>
    <span>{brand.country || "WATCHMAKING"}</span>
  </>;
}
