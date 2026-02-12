'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchProps {
    placeholder: string;
    paramName?: string;
    className?: string;
}

export function Search({ placeholder, paramName = 'search', className }: SearchProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set(paramName, term);
        } else {
            params.delete(paramName);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className={`relative flex flex-1 flex-shrink-0 ${className}`}>
            <label htmlFor="search" className="sr-only">
                Buscar
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get(paramName)?.toString()}
            />
        </div>
    );
}
