import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

const AdminPagination = ({
    currentPage,
    totalPages,
    totalCount,
    countLabel = 'mục',
    onPageChange
}) => {
    // If no total count and only 1 page, we still might want to show "Total: 0"
    // but typically if totalCount is 0, we show that.

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`h-7 min-w-[28px] px-1.5 rounded-md text-[10px] font-bold transition-all
                        ${currentPage === i
                            ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'
                            : 'text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="p-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {/* Total Count on Left */}
            <p className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                Tổng: <span className="text-slate-900">{totalCount}</span> {countLabel}
            </p>

            {/* Pagination Controls on Right */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="h-8 w-8 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {totalPages > 0 && (
                    <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-2xl bg-slate-100/50 border border-slate-200/30">
                        {renderPageNumbers()}
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="h-8 w-8 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default AdminPagination;
