import { createElement } from 'react';
import { Watch, Users, Dumbbell, Gauge, Cpu, Shield, Sparkles } from 'lucide-react';

// Map slug/tên danh mục → icon Lucide dùng chung cho Sidebar & CategoryCircleRow
const KEYWORDS = [
    { keys: ['co', 'cơ', 'automatic', 'mechanical'], icon: Gauge },
    { keys: ['pin', 'quartz', 'smart', 'digital'], icon: Cpu },
    { keys: ['the-thao', 'thể thao', 'sport', 'diver', 'lặn'], icon: Dumbbell },
    { keys: ['quan-doi', 'quân đội', 'military', 'g-shock'], icon: Shield },
    { keys: ['doi', 'đôi', 'couple', 'nu', 'nữ', 'nam'], icon: Users },
];

export function categoryIcon(category) {
    const slug = (category?.slug || '').toLowerCase();
    const name = (category?.name || '').toLowerCase();
    const hit = KEYWORDS.find((k) => k.keys.some((s) => slug.includes(s) || name.includes(s)));
    return hit?.icon || (slug.includes('lux') || slug.includes('cao-cap') ? Sparkles : Watch);
}

// Dùng createElement (không gán component vào biến trong render — React Compiler chặn)
export const CategoryGlyph = ({ category, className, strokeWidth = 2 }) =>
    createElement(categoryIcon(category), { className, strokeWidth, 'aria-hidden': true });
