import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';

const PriceRangeSlider = ({ min, max, initialMin, initialMax, onApply, isDark }) => {
    const [minVal, setMinVal] = useState(initialMin || 0);
    const [maxVal, setMaxVal] = useState(initialMax || max);

    useEffect(() => {
        setMinVal(initialMin || 0);
        setMaxVal(initialMax || max);
    }, [initialMin, initialMax, max]);

    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxVal - 1000000);
        setMinVal(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minVal + 1000000);
        setMaxVal(value);
    };

    return (
        <div className="w-full px-2 py-4">
            <div className="relative w-full h-1 mt-6">
                {/* Track Background */}
                <div className={`absolute h-full w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-zinc-100'}`} />

                {/* Selected Range Highlight */}
                <div
                    className="absolute h-full bg-amber-500 rounded-full opacity-60"
                    style={{
                        left: `${getPercent(minVal)}%`,
                        width: `${getPercent(maxVal) - getPercent(minVal)}%`
                    }}
                />

                {/* Min Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:cursor-pointer"
                    style={{ zIndex: minVal > max - 100 ? '50' : '30' }}
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:cursor-pointer"
                />
            </div>

            <div className="flex justify-between items-center mt-8 mb-4">
                <div className="flex flex-col">
                    <span className={`text-[9px] uppercase font-bold mb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Từ</span>
                    <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{formatCurrency(minVal)}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[9px] uppercase font-bold mb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Đến</span>
                    <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{formatCurrency(maxVal)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                    onClick={() => {
                        setMinVal(0);
                        setMaxVal(max);
                        onApply(0, '');
                    }}
                    className={`px-3 py-2 text-[10px] uppercase font-bold border transition-all ${isDark
                        ? 'border-white/5 text-zinc-500 hover:text-white hover:border-white/20'
                        : 'border-zinc-100 text-zinc-400 hover:text-zinc-900 hover:border-zinc-200'
                        }`}
                >
                    Đặt lại
                </button>
                <button
                    onClick={() => onApply(minVal, maxVal === max ? '' : maxVal)}
                    className="px-3 py-2 bg-amber-600 text-white text-[10px] uppercase font-bold hover:bg-amber-700 transition-colors"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
