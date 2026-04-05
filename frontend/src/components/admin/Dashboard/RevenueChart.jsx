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
import { TrendingUp, Calendar, RefreshCw, ChevronDown } from "lucide-react";
import adminApi from "../../../api/admin.api";
import { formatCurrency } from "../../../utils/formatCurrency";

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

const toInputDate = (d) => d.toISOString().split("T")[0];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl p-3 ring-1 ring-black/5">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
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
  const defaultStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [startDate, setStartDate] = useState(toInputDate(defaultStart));
  const [endDate, setEndDate] = useState(toInputDate(now));

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + (d.orders || 0), 0);

  const fetchData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const res = await adminApi.getRevenueStats(start, end);
      const mapped = (res.revenue_history || []).map((h) => ({
        name: `${h.month}/${String(h.year).slice(2)}`,
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
  }, [fetchData]);

  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    const s = toInputDate(start);
    const e = toInputDate(end);
    setStartDate(s);
    setEndDate(e);
    setActivePreset(days);
    fetchData(s, e);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Upper Header: Title & Presets */}
      <div className="p-6 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Doanh thu hệ thống</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium ml-11">
            Theo dõi biến động và hiệu suất bán hàng
          </p>
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              onClick={() => applyPreset(p.days)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activePreset === p.days
                ? "bg-white text-amber-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4 px-6 mt-6">
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng đơn hàng</p>
          <p className="text-xl font-black text-slate-900 mt-1">{totalOrders} <span className="text-sm font-medium text-slate-500 text-normal font-sans">Đơn</span></p>
        </div>
      </div>

      {/* Date Range Picker - Slim Version */}
      <div className="px-6 mt-4 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 shadow-sm">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="outline-none bg-transparent"
          />
          <span className="text-slate-300">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="outline-none bg-transparent"
          />
          <button onClick={() => fetchData(startDate, endDate)} className="ml-2 hover:text-amber-600 transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-80 w-full mt-4 px-2 pb-6 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Đang cập nhật...</span>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          {/* Chuyển từ AreaChart sang BarChart */}
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Giữ lưới ngang đơn giản */}
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#e2e8f0' }} // Đường trục X phẳng
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) =>
                val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#f8fafc' }} // Hiệu ứng highlight nhẹ khi di chuột qua vùng cột
            />

            {/* Hiển thị Bar phẳng, vuông vức */}
            <Bar
              dataKey="revenue"
              fill="#f59e0b" // Màu cam đồng nhất
              barSize={35}    // Độ rộng cột
              radius={0}      // Ép vuông góc hoàn toàn (không bo góc)
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;