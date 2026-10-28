import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon, ShoppingBag } from "lucide-react";
import DashboardPanel from "../Common/DashboardPanel";
import {
  ORDER_STATUS_TOKEN,
  STATUS_FALLBACK_TOKEN,
  useChartTokens,
} from "../../../utils/chartTokens";

const RADIAN = Math.PI / 180;
const LABEL_GAP = 14;
// Lát cắt quá nhỏ thì nhãn ngoài dễ chồng nhau → chỉ để legend liệt kê
const MIN_LABEL_SHARE = 0.04;

// Nhãn % đặt ngoài vòng tròn kèm đường dẫn (leader line)
const makeOutsideLabel = (fill, lineColor) =>
  function OutsideLabel({ cx, cy, midAngle, outerRadius, percent }) {
    if (percent < MIN_LABEL_SHARE) return null;
    const cos = Math.cos(-midAngle * RADIAN);
    const sin = Math.sin(-midAngle * RADIAN);
    const isRight = cos >= 0;
    const startX = cx + (outerRadius + 2) * cos;
    const startY = cy + (outerRadius + 2) * sin;
    const bendX = cx + (outerRadius + LABEL_GAP) * cos;
    const bendY = cy + (outerRadius + LABEL_GAP) * sin;
    const textX = bendX + (isRight ? 8 : -8);
    return (
      <g>
        <polyline
          points={`${startX},${startY} ${bendX},${bendY} ${textX},${bendY}`}
          fill="none"
          stroke={lineColor}
          strokeWidth={1}
        />
        <text
          x={textX + (isRight ? 2 : -2)}
          y={bendY}
          fill={fill}
          fontSize={11.5}
          fontWeight={700}
          textAnchor={isRight ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${Math.round(percent * 100)}%`}
        </text>
      </g>
    );
  };

const StatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-hover">
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {entry.name}
      </p>
      <p className="text-sm font-extrabold text-navy-600 tabular-nums dark:text-navy-100">
        {entry.value} đơn · {Math.round(entry.share * 100)}%
      </p>
    </div>
  );
};

// Phân bổ đơn hàng theo trạng thái — tính trên MỌI trạng thái (kể cả hủy/hoàn)
const OrderStatusPie = ({ data }) => {
  const rows = [...(data || [])].sort((a, b) => b.value - a.value);
  const total = rows.reduce((sum, entry) => sum + entry.value, 0);
  const slices = rows.map((entry) => ({
    ...entry,
    share: total > 0 ? entry.value / total : 0,
  }));

  const chart = useChartTokens([
    ...new Set(
      rows.map(
        (entry) => ORDER_STATUS_TOKEN[entry.status] ?? STATUS_FALLBACK_TOKEN,
      ),
    ),
    "card-foreground",
    "navy-200",
    "card",
    "muted-foreground",
    "border",
    "muted",
  ]);
  const colorOf = (entry) =>
    chart[ORDER_STATUS_TOKEN[entry.status] ?? STATUS_FALLBACK_TOKEN];
  const renderOutsideLabel = makeOutsideLabel(
    chart["card-foreground"],
    chart["navy-200"],
  );

  return (
    <DashboardPanel
      icon={PieIcon}
      title="Trạng thái đơn hàng"
      subtitle={`${total} đơn · mọi trạng thái`}
      bodyClassName="flex flex-col"
    >
      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 py-10">
          <ShoppingBag className="mb-1 h-7 w-7 text-muted-foreground" />
          <p className="text-sm font-semibold text-muted-foreground">
            Chưa có dữ liệu
          </p>
        </div>
      ) : (
        <>
          <div className="relative h-60 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={slices}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={78}
                  paddingAngle={2}
                  cornerRadius={5}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                  labelLine={false}
                  label={renderOutsideLabel}
                  animationDuration={800}
                >
                  {slices.map((entry) => (
                    <Cell key={entry.status} fill={colorOf(entry)} />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-navy-600 tabular-nums dark:text-navy-100">
                {total}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Đơn hàng
              </span>
            </div>
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {slices.map((entry) => (
              <li
                key={entry.status}
                className="flex min-w-0 items-center gap-2"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: colorOf(entry) }}
                />
                <span className="truncate text-[12.5px] font-medium text-card-foreground">
                  {entry.name}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardPanel>
  );
};

export default OrderStatusPie;
