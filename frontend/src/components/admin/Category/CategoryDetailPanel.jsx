import { Eye, EyeOff, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FormSection from "../Common/FormSection";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { CategoryGlyph } from "../../../constants/categoryIcons";
import { formatDate } from "../../../utils/formatCurrency";

const MetaCell = ({ label, value, className }) => (
  <div className={cn("rounded-lg border border-border bg-navy-50/50 px-3 py-2 dark:bg-navy-500/8", className)}>
    <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground whitespace-nowrap">
      {label}
    </p>
    <p className="mt-0.5 text-[13px] font-extrabold tabular-nums text-navy-700 dark:text-navy-100">
      {value}
    </p>
  </div>
);

// Cột phải chế độ master–detail: đọc nhanh + 4 tác vụ trên đúng danh mục đang chọn
const CategoryDetailPanel = ({ category, path = [], onEdit, onToggle, onDelete, onCreateChild }) => {
  if (!category) {
    return (
      <FormSection title="Chi tiết danh mục" hint="Chọn một danh mục ở cột trái" icon={FolderPlus}>
        <p className="py-10 text-center text-[13px] text-muted-foreground">
          Chưa có danh mục nào để hiển thị.
        </p>
      </FormSection>
    );
  }

  const parentName = path.length > 1 ? path[path.length - 2].name : null;

  return (
    <FormSection
      title="Chi tiết danh mục"
      hint={path.map((node) => node.name).join(" › ") || category.name}
      icon={FolderPlus}
      actions={
        <Badge variant={category.is_active ? "success" : "muted"}>
          {category.is_active ? "Đang hiển thị" : "Đang ẩn"}
        </Badge>
      }
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-50 ring-1 ring-navy-500/15 dark:bg-navy-500/10">
          {category.image_url ? (
            <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
          ) : (
            <CategoryGlyph
              category={category}
              className="h-6 w-6 text-navy-600 dark:text-navy-200"
              strokeWidth={1.75}
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-extrabold tracking-tight text-foreground">
            {category.name}
          </h3>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            /danh-muc/{category.slug}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {parentName ? (
              <>
                Danh mục cha:{" "}
                <span className="font-bold text-navy-700 dark:text-navy-100">{parentName}</span>
              </>
            ) : (
              <span className="font-bold text-navy-700 dark:text-navy-100">Danh mục gốc</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetaCell label="Danh mục con" value={category.child_count ?? 0} />
        <MetaCell label="Sản phẩm" value={category.product_count ?? 0} />
        <MetaCell label="Cả nhánh" value={category.subtree_product_count ?? 0} />
        <MetaCell label="Thứ tự" value={category.sort_order ?? 0} />
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">Mô tả</p>
        <p
          className={cn(
            "mt-1 text-[13px] leading-relaxed",
            category.description ? "text-foreground" : "italic text-muted-foreground",
          )}
        >
          {category.description || "Chưa có mô tả cho danh mục này."}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Tạo ngày {formatDate(category.created_at)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button size="sm" onClick={() => onEdit(category)} className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} /> Sửa danh mục
        </Button>
        <Button
          variant="buy"
          size="sm"
          onClick={() => onCreateChild(category)}
          className="gap-1.5"
        >
          <FolderPlus className="h-3.5 w-3.5" strokeWidth={2} /> Thêm danh mục con
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggle(category)}
          className="gap-1.5"
        >
          {category.is_active ? (
            <>
              <EyeOff className="h-3.5 w-3.5" strokeWidth={2} /> Ẩn danh mục
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" strokeWidth={2} /> Cho hiển thị
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          className="ml-auto gap-1.5 text-muted-foreground hover:bg-sale-soft hover:text-sale"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} /> Xóa
        </Button>
      </div>
    </FormSection>
  );
};

export default CategoryDetailPanel;
