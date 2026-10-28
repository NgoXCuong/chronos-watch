import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "../../../../utils/formatCurrency";
import {
  ORDER_STATUS,
  ORDER_STATUS_FLOW,
} from "../../../../constants/orderStatus";

const shortDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Mốc thời gian đã đạt của từng trạng thái (lấy từ order_history)
const datesByStatus = (history = []) =>
  history.reduce((acc, entry) => {
    if (entry?.status && !acc[entry.status]) acc[entry.status] = entry.created_at;
    return acc;
  }, {});

const Step = ({ statusKey, state, date }) => {
  const meta = ORDER_STATUS[statusKey];
  const Icon = meta?.icon;
  const reached = state !== "todo";

  return (
    <li className="flex shrink-0 flex-col items-center">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
          state === "done" && "border-navy-600 bg-navy-600 text-white",
          state === "current" &&
            "border-navy-600 bg-card text-navy-700 shadow-[0_0_0_4px_rgba(15,42,74,.12)] dark:text-navy-100",
          state === "todo" && "border-border bg-card text-muted-foreground",
        )}
      >
        {state === "done" ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          Icon && <Icon className="h-4 w-4" strokeWidth={2} />
        )}
      </span>
      <span
        className={cn(
          "mt-2 text-xs font-bold uppercase tracking-[0.02em] whitespace-nowrap",
          reached
            ? "text-navy-700 dark:text-navy-100"
            : "text-muted-foreground",
        )}
      >
        {meta?.label ?? statusKey}
      </span>
      <span className="mt-0.5 text-[11px] whitespace-nowrap tabular-nums text-muted-foreground">
        {state === "current" ? "Đang ở đây" : (shortDate(date) || "—")}
      </span>
    </li>
  );
};

// Nối hai vòng tròn liên tiếp bằng đúng phần còn lại của hàng
const Link = ({ done }) => (
  <span
    aria-hidden="true"
    className={cn(
      "mx-1.5 mt-[17px] h-0.5 min-w-4 flex-1 rounded-full",
      done ? "bg-navy-600" : "bg-border",
    )}
  />
);

// Dòng chảy trạng thái 5 bước + mốc hủy/hoàn (dữ liệu thật từ history)
// Không có khung riêng — đặt trong dải chân của OrderTaskConsole
const OrderStatusStepper = ({ status, history = [] }) => {
  const dates = datesByStatus(history);
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);
  const closed = currentIndex === -1;
  const stateOf = (i) =>
    closed || i > currentIndex ? "todo" : i < currentIndex ? "done" : "current";

  return (
    <div>
      <ol className="flex items-start">
        {ORDER_STATUS_FLOW.map((statusKey, i) => (
          <Fragment key={statusKey}>
            {i > 0 && <Link done={!closed && i <= currentIndex} />}
            <Step
              statusKey={statusKey}
              date={dates[statusKey]}
              state={stateOf(i)}
            />
          </Fragment>
        ))}
      </ol>

      {closed && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-3.5 text-[13px]">
          <span className="text-muted-foreground">Đơn đã</span>
          <span
            className={cn(
              "font-bold uppercase tracking-[0.02em]",
              status === "cancelled" ? "text-sale" : "text-muted-foreground",
            )}
          >
            {status === "cancelled" ? "hủy" : "hoàn trả"}
          </span>
          {dates[status] && (
            <span className="tabular-nums text-muted-foreground">
              · {formatDate(dates[status])}
            </span>
          )}
          <span className="text-muted-foreground">
            · không còn bước xử lý nào
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderStatusStepper;
