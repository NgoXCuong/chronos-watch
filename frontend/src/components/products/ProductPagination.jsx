import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductPagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        // Always show first page if not in range
        if (start > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => onPageChange(1)}
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                        ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                    1
                </button>
            );
            if (start > 2) pages.push(<span key="dots-start" className="text-zinc-500 px-1 truncate">...</span>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                        ${currentPage === i
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 scale-110'
                            : (isDark 
                                ? 'text-zinc-500 hover:text-white hover:bg-white/5' 
                                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100')
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Always show last page if not in range
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push(<span key="dots-end" className="text-zinc-500 px-1 truncate">...</span>);
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                        ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 md:gap-4 mt-16 animate-fade-in-up">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`p-2.5 rounded-full border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed
                    ${isDark 
                        ? 'border-white/5 text-white hover:bg-white/5' 
                        : 'border-zinc-200 text-zinc-900 hover:bg-zinc-100 shadow-sm'}`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
                {renderPageNumbers()}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`p-2.5 rounded-full border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed
                    ${isDark 
                        ? 'border-white/5 text-white hover:bg-white/5' 
                        : 'border-zinc-200 text-zinc-900 hover:bg-zinc-100 shadow-sm'}`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ProductPagination;
