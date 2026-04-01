import React from 'react';
import { cn } from '../../../lib/utils';

const StatCard = ({ 
    title, 
    label, 
    value, 
    icon: Icon, 
    trend, 
    trendColor,
    color, 
    bg,
    dot,
    pulse,
    hist = [],
    chartColor = "#F59E0B",
    loading 
}) => {
    const displayTitle = title || label;
    
    // Default colors if not provided
    const defaultBg = "bg-white";
    const defaultText = "text-slate-900";
    const iconColor = color || "text-amber-600";

    return (
        <div className={cn(
            "p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px] group relative overflow-hidden",
            bg || defaultBg
        )}>
            {/* Background sparkle effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={cn(
                    "p-3.5 rounded-2xl border transition-all duration-500 group-hover:rotate-12 shadow-sm shrink-0",
                    bg === "bg-white" || !bg ? "bg-slate-50 border-slate-100" : "bg-white/10 border-white/20"
                )}>
                    {Icon && <Icon className={cn("h-5 w-5", color || "text-amber-500")} />}
                </div>
                
                {trend && (
                    <div className="flex flex-col items-end">
                        <span className={cn(
                            "text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm transition-all duration-500 group-hover:scale-105 uppercase tracking-tighter",
                            trendColor || (trend.startsWith('+') ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")
                        )}>
                            {trend}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                    {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot, pulse && "animate-pulse")} />}
                    <p className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap",
                        bg && bg !== "bg-white" ? "text-white/60" : "text-slate-400"
                    )}>
                        {displayTitle}
                    </p>
                </div>
                
                {loading ? (
                    <div className="h-8 w-24 bg-slate-100/20 animate-pulse rounded-lg mt-2"></div>
                ) : (
                    <h3 className={cn(
                        "text-2xl font-black tracking-tight mt-1",
                        bg && bg !== "bg-white" ? "text-white" : "text-slate-900"
                    )}>
                        {value}
                    </h3>
                )}
            </div>

            {/* Micro Sparkline (SVG) */}
            {hist && hist.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity duration-700">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <path
                            d={`M ${hist.map((val, i) => `${(i / (hist.length - 1)) * 100},${40 - (val / Math.max(...hist)) * 30}`).join(' L ')}`}
                            fill="none"
                            stroke={chartColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            {/* Bottom highlight */}
            <div className={cn(
                "absolute bottom-0 left-0 h-1 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left opacity-50",
                bg === "bg-white" || !bg ? "bg-amber-500" : "bg-white"
            )}></div>
        </div>
    );
};

export default StatCard;
