import React from "react";
import { cn } from "@/lib/utils";

const AdminHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/60 backdrop-blur-md p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-500 hover:bg-white/90">
      <div className="space-y-1 animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
          <span className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]"></span>
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-sm font-normal ml-4">
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
