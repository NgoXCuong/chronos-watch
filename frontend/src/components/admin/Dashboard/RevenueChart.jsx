import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const RevenueChart = ({ data, formatCurrency }) => {
    return (
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                        Theo dõi doanh thu
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider italic">Số liệu thống kê 6 tháng gần nhất</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold text-amber-900 uppercase">Doanh thu</span>
                    </div>
                </div>
            </div>
            <div className="h-[320px] w-full relative">
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                        <TrendingUp className="h-10 w-10 text-slate-200 mb-2" />
                        <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu doanh thu</p>
                        <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Dữ liệu sẽ hiển thị khi có đơn hàng thành công</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;
