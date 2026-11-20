import { ArrowUpRight, Boxes, ChevronRight, Eye, EyeOff, FolderPlus, GitBranch, Layers, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CategoryGlyph } from '../../../constants/categoryIcons';
import { formatDate } from '../../../utils/formatCurrency';
import CategoryMetric from './CategoryMetric';

export default function CategoryDetailPanel({ category, path = [], onSelect, onEdit, onToggle, onDelete, onCreateChild }) {
    if (!category) return <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center"><Layers size={32} className="text-muted-foreground" /><h2 className="font-semibold">Không gian danh mục</h2><p className="text-sm text-muted-foreground">Chọn một danh mục bên trái để xem và quản lý.</p></section>;
    const parent = path.length > 1 ? path[path.length - 2] : null;
    const children = category.children || [];
    return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <header className="category-detail-header">
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">{category.image_url ? <img src={category.image_url} alt="" className="size-full object-contain" /> : <CategoryGlyph category={category} className="size-5 text-primary" />}</span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="break-words text-xl font-semibold tracking-tight">{category.name}</h2><Badge variant={category.is_active ? 'success' : 'muted'}>{category.is_active ? 'Đang hiển thị' : 'Đang ẩn'}</Badge></div><p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">/{category.slug}</p></div>
            <Button size="sm" onClick={() => onEdit(category)}><Pencil size={14} />Chỉnh sửa</Button>
        </header>
        <div className="space-y-4 p-4">
            <section className="rounded-xl border border-border bg-muted/35 p-3" aria-label="Vị trí trong cây danh mục">
                <div className="mb-2 flex items-center gap-2"><GitBranch size={14} className="text-primary" /><h3 className="text-[11px] font-bold uppercase tracking-wider">Quan hệ cha – con</h3><Badge variant="muted" className="ml-auto">{parent ? `Cấp ${path.length} · Danh mục con` : 'Cấp 1 · Danh mục gốc'}</Badge></div>
                <nav className="flex flex-wrap items-center gap-1.5" aria-label="Đường dẫn danh mục">{path.map((node,index) => <span key={node.id} className="inline-flex min-w-0 items-center gap-1.5">{index > 0 && <ChevronRight size={14} className="shrink-0 text-muted-foreground" />}{index === path.length - 1 ? <span aria-current="page" className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">{node.name}</span> : <button type="button" onClick={() => onSelect(node.id)} className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-accent">{node.name}<span className="ml-2 text-[10px] font-normal text-muted-foreground">{index === path.length-2 ? 'Cha' : 'Gốc'}</span></button>}</span>)}</nav>
                {children.length > 0 ? <div className="ml-3 mt-2 grid gap-1.5 border-l-2 border-navy-200 pl-4 sm:grid-cols-2">{children.map((child) => <button type="button" key={child.id} onClick={() => onSelect(child.id)} className="category-child-link flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left hover:bg-accent/50"><span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">CON</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{child.name}</span><span className="text-[10px] tabular-nums text-muted-foreground">{child.product_count ?? 0} SP</span><ArrowUpRight size={12} className="shrink-0" /></button>)}</div> : <p className="mt-2 text-[11px] text-muted-foreground">{parent ? `Trực thuộc ${parent.name}. Chưa có danh mục con.` : 'Danh mục cấp cao nhất, không có danh mục cha. Chưa có nhánh con.'}</p>}
            </section>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CategoryMetric icon={Boxes} label="Sản phẩm trực tiếp" value={category.product_count} hint="Gắn trực tiếp vào danh mục này" tone="navy" />
                <CategoryMetric icon={GitBranch} label="Sản phẩm cả nhánh" value={category.subtree_product_count} hint="Bao gồm sản phẩm ở danh mục con" tone="teal" />
                <CategoryMetric icon={Layers} label="Danh mục con" value={category.child_count ?? children.length} hint="Số nhánh con trực tiếp" tone="violet" />
            </div>
            <section><h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider">Mô tả</h3><p className="whitespace-pre-line break-words text-[13px] leading-6 text-muted-foreground">{category.description || 'Chưa có mô tả cho danh mục này.'}</p></section>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground"><p>Thứ tự: <strong className="text-foreground">{category.sort_order ?? 0}</strong><span className="mx-2">·</span>Tạo ngày {formatDate(category.created_at)}</p><Button size="sm" variant="outline" onClick={() => onCreateChild(category)}><FolderPlus size={14} />Thêm danh mục con</Button></div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 px-4 py-3"><Button variant="outline" size="sm" onClick={() => onToggle(category)}>{category.is_active ? <EyeOff size={14} /> : <Eye size={14} />}{category.is_active ? 'Ẩn danh mục' : 'Cho hiển thị'}</Button><Button variant="ghost" size="sm" onClick={() => onDelete(category)} className="text-muted-foreground hover:bg-sale-soft hover:text-sale"><Trash2 size={14} />Xóa danh mục</Button></footer>
    </section>;
}
