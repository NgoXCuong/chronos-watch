import React from 'react';

export const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
        {children} {required && <span className="text-rose-500">*</span>}
    </label>
);

export const SectionTitle = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <Icon className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{children}</h3>
    </div>
);

export const EditorCard = ({ children, className = "" }) => (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ${className}`}>
        {children}
    </div>
);
