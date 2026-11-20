import { uiTone } from './uiTones';

// Màu dành riêng cho số liệu xếp hạng, dùng thống nhất ở hai thẻ dashboard.
const RANK_TONES = ['teal', 'violet', 'navy', 'success', 'warning'];
export const rankingTone = (rank) => uiTone(RANK_TONES[rank - 1] || 'navy');
