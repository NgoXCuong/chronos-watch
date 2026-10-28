import { useState } from "react";
import { Link } from "react-router-dom";
import { Ban, Printer, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  canCancelOrder,
  needsTransferAction,
  orderCode,
  showsWarrantyLink,
  unpaidAmount,
  warrantiesLinkForOrder,
} from "@/utils/myOrders";

const InlineCancelConfirm = ({ order, busy, onCancel, onKeep }) => (
  <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-sale/30 bg-sale-soft px-4 py-2.5">
    <p className="text-[12px] font-medium text-sale">
      Hủy đơn {orderCode(order)}? Kho và mã ưu đãi sẽ được hoàn lại ngay.
    </p>
    <Button
      variant="destructive"
      size="sm"
      loading={busy === "cancel"}
      disabled={Boolean(busy)}
      onClick={onCancel}
    >
      Xác nhận hủy
    </Button>
    <Button variant="ghost" size="sm" onClick={onKeep}>
      Để lại
    </Button>
  </div>
);

/**
 * Bảng tác vụ của đơn: mỗi nút chỉ hiện khi trạng thái đơn cho phép (đúng sơ đồ
 * backend chặn ở order.service). Hủy dùng confirm nội dòng, không window.confirm.
 */
const OrderDetailActions = ({ order, busy, onConfirmTransfer, onCancel }) => {
  const [askCancel, setAskCancel] = useState(false);
  const remaining = unpaidAmount(order);

  if (askCancel) {
    return (
      <div className="print:hidden">
        <InlineCancelConfirm
          order={order}
          busy={busy}
          onCancel={() => onCancel()}
          onKeep={() => setAskCancel(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      {needsTransferAction(order) && (
        <Button
          size="sm"
          variant="buy"
          loading={busy === "transfer"}
          disabled={Boolean(busy)}
          onClick={onConfirmTransfer}
          className="gap-1.5"
        >
          <Wallet size={14} strokeWidth={2} aria-hidden="true" />
          Xác nhận đã chuyển khoản{remaining > 0 && ` · ${formatCurrency(remaining)}`}
        </Button>
      )}

      {showsWarrantyLink(order) && (
        <Link to={warrantiesLinkForOrder(order.id)}>
          <Button size="sm" variant="outline" className="gap-1.5">
            <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
            Phiếu bảo hành
          </Button>
        </Link>
      )}

      {canCancelOrder(order) && (
        <Button
          size="sm"
          variant="ghost"
          disabled={Boolean(busy)}
          onClick={() => setAskCancel(true)}
          className="gap-1.5 text-sale hover:text-sale"
        >
          <Ban size={14} strokeWidth={2} aria-hidden="true" />
          Hủy đơn
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.print()}
        className="gap-1.5 text-navy-600 hover:text-navy-700"
      >
        <Printer size={14} strokeWidth={2} aria-hidden="true" />
        In đơn
      </Button>
    </div>
  );
};

export default OrderDetailActions;
