'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center space-x-6 mt-8">
            {currentPage > 1 ? (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                </Link>
            ) : (
                <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                </div>
            )}

            <span className="text-sm text-gray-700">
                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </span>

            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
            ) : (
                <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed">
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                </div>
            )}
        </div>
    );
}
