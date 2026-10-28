import { Star } from 'lucide-react';
import { cn } from '../../../lib/utils';

/** 5 sao tĩnh. Vàng là ngoại lệ màu duy nhất trong design system (điểm rating). */
const Stars = ({ rating, size = 13, className }) => {
    const value = Math.round(Number(rating) || 0);
    return (
        <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`${value}/5 sao`}>
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    strokeWidth={1.5}
                    className={cn(s <= value ? 'fill-amber-400 text-amber-400' : 'text-navy-200')}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export default Stars;
