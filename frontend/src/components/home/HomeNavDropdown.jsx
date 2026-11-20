import "../../styles/catalog-menu.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function HomeNavDropdown({ label, to, groups, loading = false, active = false }) {
  const [open, setOpen] = useState(false);
  return <DropdownMenu open={open} onOpenChange={setOpen}>
    <DropdownMenuTrigger render={<Link to={to} />} nativeButton={false} onClick={() => setOpen(false)} openOnHover delay={100} closeDelay={180} aria-label="Danh mục sản phẩm" className={cn("storefront-nav-item catalog-menu-trigger", active && "active")}>
      {label}<ChevronDown size={13} aria-hidden="true" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" sideOffset={0} className="catalog-menu-popup">
      <div className="catalog-menu-header">
        <div><p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Bộ sưu tập Chronos</p><p className="mt-1 text-base font-semibold text-foreground">Tìm chiếc đồng hồ của bạn</p></div>
        <DropdownMenuItem render={<Link to={to} />} className="gap-2 px-3 py-2 text-xs font-semibold text-primary">Tất cả sản phẩm<ArrowUpRight size={14} /></DropdownMenuItem>
      </div>
      {loading && <div className="m-4 h-10 animate-pulse rounded bg-muted" aria-label="Đang tải danh mục" />}
      <div className="catalog-menu-grid">{groups.filter((group) => group.items.length).map((group) => <DropdownMenuGroup key={group.title}>
        <DropdownMenuLabel className="catalog-menu-label">{group.title}</DropdownMenuLabel>
        <div className="catalog-menu-items">{group.items.map((item) => <DropdownMenuItem key={item.to} render={<Link to={item.to} />} className="catalog-menu-item">{item.label}</DropdownMenuItem>)}</div>
      </DropdownMenuGroup>)}</div>
    </DropdownMenuContent>
  </DropdownMenu>;
}
