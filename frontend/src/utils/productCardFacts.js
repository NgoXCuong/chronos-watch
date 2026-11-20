const firstValue = (specs, keys) => keys.map((key) => specs[key]).find((value) => typeof value === "string" && value.trim());

export function productCardFacts(product) {
  let specs = product.specifications || {};
  if (typeof specs === "string") {
    try { specs = JSON.parse(specs); } catch { return []; }
  }
  if (!specs || typeof specs !== "object") return [];
  const groups = [
    { label: "Bộ máy", keys: ["movement", "Loại máy"] },
    { label: "Mặt kính", keys: ["glass", "Mặt kính", "Kính"] },
    { label: "Chống nước", keys: ["water_resistance", "Chống nước", "Độ chịu nước"] },
  ];
  return groups.flatMap(({ label, keys }) => {
    const value = firstValue(specs, keys);
    return value ? [{ label, value: value.trim() }] : [];
  });
}
