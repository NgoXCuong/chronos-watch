import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingBag } from "lucide-react";

const COLORS = [
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#F43F5E",
  "#94A3B8",
];

const OrderStatusPie = ({ data, totalOrders }) => {
  return (
    <div className="bg-white p-8 border border-slate-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Trạng thái đơn hàng
        </h3>
        <p className="text-md text-slate-400 font-medium mt-1">
          Cơ cấu vận hành hiện tại
        </p>
      </div>
      <div style={{ width: '100%', height: 256, overflow: 'hidden' }} className="relative">
        {data && data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">
                {totalOrders}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Đơn hàng
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-full border-2 border-dashed border-slate-100 mx-auto w-48 h-48">
            <ShoppingBag className="h-8 w-8 text-slate-500 mb-1" />
            <p className="text-md font-bold text-slate-400">
              Trống
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {data && data.length > 0 ? (
          data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {entry.name}
              </span>
              <span className="text-[10px] font-bold text-slate-900 ml-auto">
                {entry.value}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-sm text-slate-500  mt-1">
            Chưa có phân bổ trạng thái
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPie;
