import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

const SearchBanner = ({ 
    searchTerm, 
    setSearchTerm, 
    placeholder, 
    onRefresh, 
    loading, 
    count, 
    countLabel, 
    children 
}) => {
    return (
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="relative flex-1 md:max-w-sm group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors z-10" />
                <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder || "Tìm kiếm..."} 
                    className="pl-10 bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 h-10 rounded-lg text-sm transition-all shadow-sm" 
                />
            </div>
            {onRefresh && (
                <Button onClick={onRefresh} variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0">
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin text-amber-600")} />
                </Button>
            )}

            {children}

            <p className="text-xs text-slate-400 ml-auto hidden md:block font-medium">
                {countLabel || "Hiện có"} {count}
            </p>
        </div>
    );
};

export default SearchBanner;
