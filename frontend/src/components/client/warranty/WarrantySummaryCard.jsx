import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import WarrantyProgress from "./WarrantyProgress";

const Row = ({ label, children, mono = false }) => (
  <div className="flex items-start justify-between gap-3 py-2">
    <dt className="text-xs font-semibold uppercase tracking-[0.02em] text-muted-foreground">
      {label}
    </dt>
    <dd
      className={cn(
        "text-right text-[13px] font-semibold text-foreground",
        mono && "font-mono tabular-nums text-[12px]",
      )}
    >
      {children ?? "—"}
    </dd>
  </div>
);

// Tóm tắt phiếu: mã/serial mono (đối chiếu thủ công với nhân viên), mốc ngày, tiến trình
const WarrantySummaryCard = ({ warranty }) => (
  <section className="rounded-xl bg-card p-5 ring-1 ring-border">
    <h2 className="text-sm font-semibold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
      Thông tin phiếu
    </h2>

    <dl className="mt-2 divide-y divide-border">
      <Row label="Mã phiếu" mono>
        {warranty.code}
      </Row>
      <Row label="Serial" mono>
        {warranty.serial || <span className="font-sans text-[12px] italic text-muted-foreground">Chưa cập nhật</span>}
      </Row>
      <Row label="SKU" mono>
        {warranty.sku || "—"}
      </Row>
      <Row label="Đơn hàng">
        {warranty.order ? (
          <Link
            to={`/orders/${warranty.order.id}`}
            className="inline-flex items-center gap-1 font-mono text-[12px] tabular-nums text-navy-600 hover:text-navy-800"
          >
            {warranty.order.order_code}
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </Link>
        ) : (
          "—"
        )}
      </Row>
      <Row label="Bắt đầu">{formatDate(warranty.start_date)}</Row>
      <Row label="Hết hạn">{formatDate(warranty.end_date)}</Row>
      <Row label="Thời hạn">
        {warranty.warranty_months ? `${warranty.warranty_months} tháng` : "—"}
      </Row>
    </dl>

    <div className="mt-4">
      <WarrantyProgress progress={warranty.progress} state={warranty.state} showTotal />
    </div>

    {warranty.note && (
      <p className="mt-4 rounded-lg bg-muted/60 p-3 text-[12px] leading-relaxed text-foreground">
        <span className="font-semibold">Ghi chú: </span>
        {warranty.note}
      </p>
    )}
  </section>
);

export default WarrantySummaryCard;
