import { useEffect, useState } from "react";
import { CalendarDays, Inbox, Mail, Package, Phone, ShieldCheck } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { DialogCloseButton } from "../../ui/dialog";
import { cn } from "@/lib/utils";
import warrantyApi from "../../../api/warranty.api";
import { formatDateTime } from "../../../utils/formatCurrency";
import { ORDER_STATUS_BADGE, statusLabel } from "../../../constants/orderStatus";
import { RequestStatusBadge } from "./RequestCells";
import { WarrantyProgressCell, WarrantyStateBadge } from "./WarrantyCells";

const PANEL =
  "absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-200";

const Field = ({ label, value, mono = false }) => (
  <div className="min-w-0">
    <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
      {label}
    </p>
    <p
      className={cn(
        "mt-0.5 truncate text-[13px] text-card-foreground",
        mono && "font-mono tabular-nums",
      )}
    >
      {value || "Chưa cập nhật"}
    </p>
  </div>
);

const SectionTitle = ({ children }) => (
  <p className="mt-5 text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
    {children}
  </p>
);

const RequestItem = ({ request }) => (
  <li className="rounded-lg border border-border px-3 py-2.5">
    <div className="flex items-start justify-between gap-2">
      <span className="min-w-0">
        <p className="text-[11px] tabular-nums text-muted-foreground">
          Gửi {formatDateTime(request.created_at)}
        </p>
      </span>
      <RequestStatusBadge status={request.status} />
    </div>
    <p className="mt-1.5 text-[12px] leading-relaxed text-card-foreground">
      {request.issue || "Không có mô tả"}
    </p>
    {request.admin_reply ? (
      <div className="mt-2 rounded-lg bg-navy-50/70 px-3 py-2 dark:bg-navy-500/10">
        <p className="text-[11px] font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
          Phản hồi{request.handler ? ` · ${request.handler.username}` : ""}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-card-foreground">
          {request.admin_reply}
        </p>
        {request.replied_at && (
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
            {formatDateTime(request.replied_at)}
          </p>
        )}
      </div>
    ) : (
      <p className="mt-2 text-[11px] text-muted-foreground">Chưa có phản hồi từ admin.</p>
    )}
  </li>
);

// Panel chi tiết mount theo key(warrantyId) — mỗi lần mở là state mới, không cần effect seed
const WarrantyDetailBody = ({ warrantyId, onClose }) => {
  const [view, setView] = useState({ loading: true, warranty: null, error: null });

  useEffect(() => {
    let alive = true;
    warrantyApi
      .getDetail(warrantyId)
      .then((data) =>
        alive && setView({ loading: false, warranty: data.warranty, error: null }),
      )
      .catch(() =>
        alive && setView({ loading: false, warranty: null, error: "Không tải được phiếu bảo hành" }),
      );
    return () => {
      alive = false;
    };
  }, [warrantyId]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const warranty = view.warranty;
  const customer = warranty?.user ?? {};
  const order = warranty?.order ?? {};
  const requests = warranty?.requests ?? [];

  return (
    <div className={PANEL}>
      <header className="flex items-start justify-between gap-3 border-b border-border bg-navy-50/60 px-5 py-4 dark:bg-navy-500/10">
        <div className="min-w-0">
          <p className="truncate font-mono text-[15px] font-extrabold tabular-nums text-navy-700 dark:text-navy-100">
            {view.loading ? "Đang tải phiếu..." : warranty?.code}
          </p>
          <p className="mt-0.5 flex items-center gap-2">
            <WarrantyStateBadge state={warranty?.state} />
            <span className="truncate text-[11px] tabular-nums text-muted-foreground">
              {warranty ? `Lập phiếu ${formatDateTime(warranty.created_at)}` : ""}
            </span>
          </p>
        </div>
        <DialogCloseButton onClick={onClose} />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {view.error && (
          <p className="mt-4 rounded-lg bg-sale-soft px-3 py-2 text-[12px] font-semibold text-sale">
            {view.error}
          </p>
        )}

        {!view.loading && warranty && (
          <>
            <SectionTitle>Sản phẩm</SectionTitle>
            <div className="mt-2 flex items-start gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tên sản phẩm" value={warranty.product_name} />
                <Field label="SKU" value={warranty.sku} mono />
                <Field label="Serial" value={warranty.serial} mono />
                <Field
                  label="Thời hạn bảo hành"
                  value={`${Number(warranty.warranty_months) || 0} tháng`}
                />
              </div>
            </div>

            <SectionTitle>Khách hàng</SectionTitle>
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Họ tên" value={warranty.user?.full_name || warranty.user?.username} />
                <Field label="Tài khoản" value={customer.username} mono />
              </div>
              <p className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {customer.email || "Không email"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {customer.phone || "Không SĐT"}
                </span>
              </p>
            </div>

            <SectionTitle>Đơn hàng gốc</SectionTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[13px] tabular-nums text-navy-700 dark:text-navy-100">
                {order.order_code || "Không rõ"}
              </span>
              {order.status && (
                <Badge variant={ORDER_STATUS_BADGE[order.status] ?? "muted"}>
                  {statusLabel(order.status)}
                </Badge>
              )}
            </div>

            <SectionTitle>Điều khoản</SectionTitle>
            <div className="mt-2 flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ngày bắt đầu" value={formatDateTime(warranty.start_date)} />
                  <Field label="Ngày hết hạn" value={formatDateTime(warranty.end_date)} />
                </div>
                <div className="mt-3 max-w-[220px]">
                  <WarrantyProgressCell row={warranty} />
                </div>
                <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px] leading-relaxed text-card-foreground">
                  {warranty.note || "Chưa có ghi chú kỹ thuật nào."}
                </p>
              </div>
            </div>

            <SectionTitle>
              Lịch sử yêu cầu ({requests.length})
            </SectionTitle>
            {requests.length === 0 ? (
              <p className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
                <Inbox className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                Khách chưa gửi yêu cầu bảo hành nào cho phiếu này.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {requests.map((request) => (
                  <RequestItem key={request.id} request={request} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {!view.loading && warranty && (
        <footer className="border-t border-border px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 w-full rounded-lg border-border text-[12px] font-semibold"
          >
            Đóng
          </Button>
        </footer>
      )}
    </div>
  );
};

// Overlay z-150 như Dialog (header admin sticky z-100); không có route riêng cho chi tiết
const WarrantyDetailDialog = ({ open, warrantyId, onClose }) => {
  if (!open || !warrantyId) return null;

  return (
    <div className="fixed inset-0 z-150">
      <div
        className="absolute inset-0 bg-navy-900/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <WarrantyDetailBody key={warrantyId} warrantyId={warrantyId} onClose={onClose} />
    </div>
  );
};

export default WarrantyDetailDialog;
