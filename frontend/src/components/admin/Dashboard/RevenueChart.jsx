import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Bar,
  BarChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  RefreshCw,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import adminApi from "../../../api/admin.api";
import { formatCurrency } from "../../../utils/formatCurrency";
import DateRangePicker from "../Common/DateRangePicker";

const toInputDate = (d) => d.toISOString().split("T")[0];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl p-3 ring-1 ring-black/5">
        <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">
          {label}
        </p>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-black text-slate-900">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] font-medium text-amber-600">
            {payload[0].payload.orders} đơn hàng
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(toInputDate(defaultStart));
  const [endDate, setEndDate] = useState(toInputDate(now));

  const fetchData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const res = await adminApi.getRevenueStats(start, end);
      const mapped = (res.revenue_history || []).map((h) => ({
        name: h.day
          ? `${h.day}/${h.month}`
          : `${h.month}/${String(h.year).slice(2)}`,
        revenue: parseFloat(h.revenue) || 0,
        orders: parseInt(h.orders) || 0,
      }));
      setData(mapped);
    } catch (e) {
      console.error("Lỗi tải doanh thu:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  const handleRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchData(start, end);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden font-roboto transition-all">
      {/* ERP-Style Header with Integrated DateRangePicker */}
      <div className="p-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100">
            <TrendingUp className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800t">
              Doanh thu hệ thống
            </h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">
              Biến động hiệu suất bán hàng luxury
            </p>
          </div>
        </div>

        {/* The New Advanced Date Picker Component */}
        <DateRangePicker
          onChange={handleRangeChange}
          initialStart={startDate}
          initialEnd={endDate}
        />
      </div>

      {/* Main Chart Area */}
      <div className="h-105 w-full mt-4 px-4 pb-8 relative group">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10 transition-all">
            <div className="flex flex-col items-center gap-2 scale-110">
              <RefreshCw className="h-10 w-10 text-amber-500 animate-spin" />
              <span className="text-[10px] font-black text-slate-500 uppercase">
                Đang cập nhật...
              </span>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              tickFormatter={(val) =>
                val >= 1000000
                  ? `${(val / 1000000).toFixed(1)}M`
                  : `${val / 1000}k`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#f8fafc", radius: 4 }}
            />
            <Bar
              dataKey="revenue"
              fill="#10B981"
              barSize={45}
              // radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Subtle Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-100 to-transparent opacity-30" />
      </div>
    </div>
  );
};

export default RevenueChart;
