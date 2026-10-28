import { FileText, MessageSquareReply } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WARRANTY_REQUEST_STATUS } from "@/constants/warrantyStatus";
import { formatDateTime } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import NoticeCard from "@/components/client/NoticeCard";

const RequestBadge = ({ status }) => {
  const config = WARRANTY_REQUEST_STATUS[status];
  if (!config) return <Badge variant="muted">{status}</Badge>;
  const Icon = config.icon;
  return (
    <Badge variant={config.badge}>
      <Icon className="h-3 w-3" strokeWidth={2} />
      {config.label}
    </Badge>
  );
};

// requests đến theo thứ tự mới nhất trước (order ở backend) — không sort lại ở client
const RequestEntry = ({ request, isLast }) => (
  <li className="relative flex gap-3">
    <div className="flex flex-col items-center">
      <span
        className={cn(
          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-card",
          WARRANTY_REQUEST_STATUS[request.status]?.dot ?? "bg-muted-foreground",
        )}
      />
      {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
    </div>

    <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
      <div className="flex flex-wrap items-center gap-2">
        <RequestBadge status={request.status} />
        <span className="text-[11px] font-semibold text-muted-foreground">
          {formatDateTime(request.created_at)}
        </span>
      </div>

      <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-foreground">
        {request.issue}
      </p>

      {request.admin_reply && (
        <div className="mt-2.5 rounded-lg border border-border bg-muted/50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
            <MessageSquareReply className="h-3.5 w-3.5" strokeWidth={2} />
            Phản hồi từ Chronos
            <span className="font-medium normal-case tracking-normal text-muted-foreground">
              {formatDateTime(request.replied_at)}
            </span>
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-foreground">
            {request.admin_reply}
          </p>
        </div>
      )}
    </div>
  </li>
);

const WarrantyRequestTimeline = ({ requests = [] }) => (
  <section className="rounded-xl bg-card p-5 ring-1 ring-border">
    <h2 className="text-sm font-semibold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
      Lịch sử yêu cầu bảo hành
    </h2>

    {requests.length === 0 ? (
      <NoticeCard
        icon={FileText}
        title="Chưa có yêu cầu nào"
        description="Khi đồng hồ gặp lỗi, bấm “Gửi yêu cầu bảo hành” để Chronos tiếp nhận và phản hồi tại đây."
        className="mt-4 border-0 py-10"
      />
    ) : (
      <ul className="mt-4">
        {requests.map((request, index) => (
          <RequestEntry
            key={request.id ?? `${request.created_at}-${index}`}
            request={request}
            isLast={index === requests.length - 1}
          />
        ))}
      </ul>
    )}
  </section>
);

export default WarrantyRequestTimeline;
