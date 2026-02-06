import { getOverdueLoans } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { KPICard } from '@/components/ui/kpi-card';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Using a simple server action or just re-navigation for filters in this simple example
// For a filter component (like min days), we can use the Search component pattern but with a number input

export default async function OverdueLoansPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 10;

    // Hardcoded filter example, or could handle via query params like 'minDays'
    const minDays = 0;

    const { data, metadata } = await getOverdueLoans(currentPage, limit, minDays);

    const totalOverdue = metadata.total;

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Overdue Loans</h1>
                <p className="text-gray-500 mt-1">Monitor active overdue loans and estimated fines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Total Overdue Loans"
                    value={totalOverdue}
                    icon={AlertTriangle}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Detailed List</h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Book</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-center">Days Overdue</TableHead>
                            <TableHead className="text-right">Suggested Fine</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                    No overdue loans found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((loan) => (
                                <TableRow key={loan.prestamo_id}>
                                    <TableCell>{loan.socio}</TableCell>
                                    <TableCell>{loan.libro}</TableCell>
                                    <TableCell>{new Date(loan.fecha_vencimiento).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {loan.dias_atraso} days
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-red-600">
                                        ${loan.monto_sugerido.toFixed(2)}
                                    </TableCell>
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
