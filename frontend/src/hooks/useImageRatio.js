import { useState } from 'react';

/** Ảnh có tỷ lệ > mức này là banner ngang (creative tự dựng sẵn chữ) → trưng nguyên vẹn. */
export const WIDE_RATIO = 1.25;

const cache = new Map();

/**
 * Đo tỷ lệ ảnh thật của banner để HeroBanner chọn cách hiển thị: ảnh dọc/vuông thì đè chữ
 * lên nền ảnh (thiết kế gốc), ảnh ngang thì để ảnh nguyên vẹn cả bề rộng.
 * Kết quả đo cache theo URL nên slider quay lại slide cũ không phải đo lần nữa.
 */
export const useImageRatio = (url) => {
    const [measured, setMeasured] = useState({ url: '', ratio: 0 });
    const ratio = measured.url === url ? measured.ratio : cache.get(url) || 0;

    const onImageLoad = (event) => {
        const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
        if (!width || !height) return;
        const value = width / height;
        cache.set(url, value);
        setMeasured({ url, ratio: value });
    };

    return { ratio, wide: ratio > WIDE_RATIO, onImageLoad };
};

export default useImageRatio;
