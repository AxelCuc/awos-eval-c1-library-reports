import { getMostBorrowedBooks } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Search } from '@/components/ui/search-filter';
import { KPICard } from '@/components/ui/kpi-card';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MostBorrowedPage(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 10;

    const { data, metadata } = await getMostBorrowedBooks(currentPage, limit, query);

    // KPI: Top book
    const topBook = data.length > 0 ? data[0] : null;

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Most Borrowed Books</h1>
                    <p className="text-gray-500 mt-1">Ranking of books by popularity to inform acquisition strategies.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Top Book"
                    value={topBook ? topBook.titulo : 'N/A'}
                    description={topBook ? `${topBook.total_prestamos} total loans` : ''}
                    icon={BookOpen}
                />
                {/* Can add more KPIs if aggregate data was fetched separately */}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">Book Rankings</h2>
                    <div className="w-full max-w-sm">
                        <Search placeholder="Search title or author..." paramName="query" />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Total Loans</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((book) => (
                                <TableRow key={book.libro_id}>
                                    <TableCell className="font-medium">#{book.ranking_prestamos}</TableCell>
                                    <TableCell>{book.titulo}</TableCell>
                                    <TableCell>{book.autor}</TableCell>
                                    <TableCell>{book.categoria}</TableCell>
                                    <TableCell className="text-right">{book.total_prestamos}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-200">
                    <Pagination totalPages={metadata.totalPages} />
                </div>
            </div>
        </div>
    );
}
