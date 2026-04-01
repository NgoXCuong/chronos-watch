import React from 'react';
import { STATUS_CONFIG } from './OrderTable';

const OrderStatusFilter = ({ 
    activeStatus, 
    onStatusChange, 
    totalCount, 
    counts, 
    statuses 
}) => {
    return (
        <div className="flex flex-wrap gap-2 pb-2">
            <button 
                onClick={() => onStatusChange('')} 
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${!activeStatus ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600 shadow-sm'}`}
            >
                Tất cả ({totalCount})
            </button>
            {statuses.map(({ key, label }) => (
                <button 
                    key={key} 
                    onClick={() => onStatusChange(key)} 
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 ${activeStatus === key ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600 shadow-sm'}`}
                >
                    <div className={`h-1.5 w-1.5 rounded-full ${activeStatus === key ? 'bg-white' : (STATUS_CONFIG[key]?.dot || 'bg-slate-400')}`} />
                    {label} ({counts[key] || 0})
                </button>
            ))}
        </div>
    );
};

export default OrderStatusFilter;
