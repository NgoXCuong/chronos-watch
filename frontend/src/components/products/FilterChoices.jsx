import { Children, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Giới hạn chiều dài từng nhóm, giữ toàn bộ lựa chọn khi người dùng cần xem thêm.
export default function FilterChoices({ children, limit = 6 }) {
    const [expanded, setExpanded] = useState(false);
    const items = Children.toArray(children);
    return <>
        <div className="space-y-1">{expanded ? items : items.slice(0, limit)}</div>
        {items.length > limit && <button type="button" className="catalog-filter-more" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Thu gọn' : `Xem thêm ${items.length - limit} lựa chọn`}<ChevronDown size={13} className={expanded ? 'rotate-180' : ''} />
        </button>}
    </>;
}
