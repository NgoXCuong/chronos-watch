import { useState, useEffect } from 'react';

/**
 * Custom hook hoãn cập nhật giá trị (Debounce)
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian chờ (mặc định 400ms)
 * @returns {any} Giá trị sau khi debounce
 */
export const useDebounce = (value, delay = 400) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
