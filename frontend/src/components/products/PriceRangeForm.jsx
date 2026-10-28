import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { formatTier } from '../../utils/productFilters';

const onlyDigits = (value) => String(value ?? '').replace(/[^\d]/g, '');

/** Hiển thị có dấu chấm nghìn (7000000 → 7.000.000) nhưng state vẫn là chuỗi số thô. */
const withSeparators = (digits) => (digits ? Number(digits).toLocaleString('vi-VN') : '');

const MoneyInput = ({ value, onChange, placeholder, label }) => (
    <div className="relative min-w-0 flex-1">
        <Input
            value={withSeparators(value)}
            onChange={(event) => onChange(onlyDigits(event.target.value).slice(0, 10))}
            placeholder={placeholder}
            aria-label={label}
            inputMode="numeric"
            autoComplete="off"
            className="h-9 pr-6 pl-2.5 text-[12px] tabular-nums"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-muted-foreground">
            đ
        </span>
    </div>
);

/**
 * Tự chọn khoảng giá thay cho 2 ô số + nút chen ngang (sidebar 268px làm nút bị ép).
 * State khởi tạo từ URL; FilterPanel truyền `key` theo giá đang lọc nên xóa chip giá
 * là ô nhập tự reset, không cần effect.
 */
const PriceRangeForm = ({ minPrice = '', maxPrice = '', price = {}, onApply }) => {
    const [min, setMin] = useState(String(minPrice || ''));
    const [max, setMax] = useState(String(maxPrice || ''));
    const [error, setError] = useState('');

    const submit = (event) => {
        event.preventDefault();
        if (min && max && Number(min) > Number(max)) {
            setError('Giá thấp nhất phải nhỏ hơn giá cao nhất.');
            return;
        }
        setError('');
        onApply({ minPrice: min, maxPrice: max });
    };

    return (
        <form onSubmit={submit} className="mt-3 border-t border-dashed border-border pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Hoặc tự chọn khoảng giá
            </p>

            <div className="flex items-center gap-2">
                <MoneyInput value={min} onChange={setMin} placeholder="Từ" label="Giá thấp nhất" />
                <span className="h-px w-2 shrink-0 bg-border" aria-hidden="true" />
                <MoneyInput value={max} onChange={setMax} placeholder="Đến" label="Giá cao nhất" />
            </div>

            {error ? (
                <p role="alert" className="mt-1.5 text-[11px] font-medium text-sale">
                    {error}
                </p>
            ) : (
                price?.max && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                        Giá trong danh mục: {formatTier(price.min)} – {formatTier(price.max)}
                    </p>
                )
            )}

            <Button type="submit" size="sm" className="mt-2 h-9 w-full">
                Áp dụng
            </Button>
        </form>
    );
};

export default PriceRangeForm;
