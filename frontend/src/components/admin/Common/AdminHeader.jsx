import React from 'react';

const AdminHeader = ({ title, subtitle, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-100/50 shadow-sm transition-all duration-500 hover:bg-white/80">
            <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-700">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="h-8 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></span>
                    <span className="uppercase tracking-widest">{title}</span>
                </h1>
                {subtitle && (
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
                        <span className="h-[1px] w-4 bg-slate-200"></span>
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-700 delay-200">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default AdminHeader;
