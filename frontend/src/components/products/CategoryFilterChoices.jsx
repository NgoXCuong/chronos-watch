import FilterChoices from './FilterChoices';
import FilterOptionRow from './FilterOptionRow';

const flatten = (nodes, depth = 0) => nodes.flatMap((node) => [
    { ...node, depth }, ...(depth < 1 ? flatten(node.children || [], depth + 1) : []),
]);

export default function CategoryFilterChoices({ categories, filters, applyFilters }) {
    const rows = flatten(categories);
    // Đưa lựa chọn hiện tại lên đầu để không bị ẩn dưới nút "Xem thêm".
    const ordered = [...rows.filter((n) => String(n.id) === String(filters.categoryId)), ...rows.filter((n) => String(n.id) !== String(filters.categoryId))];
    return <FilterChoices><FilterOptionRow label="Tất cả danh mục" active={!filters.categoryId} onClick={() => applyFilters({ categoryId: '', categoryLabel: '' })} />
        {ordered.map((node) => <FilterOptionRow key={node.id} label={node.name} count={node.subtree_product_count ?? node.product_count} indent={node.depth} active={String(filters.categoryId) === String(node.id)} onClick={() => applyFilters({ categoryId: String(node.id), categoryLabel: node.name })} />)}
    </FilterChoices>;
}
