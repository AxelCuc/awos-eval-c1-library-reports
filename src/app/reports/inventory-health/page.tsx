import { getInventoryHealth } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICard } from '@/components/ui/kpi-card';
import { Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InventoryHealthPage() {
    const data = await getInventoryHealth();

    const totalGlobalItems = data.reduce((acc, curr) => acc + Number(curr.total_ejemplares), 0);
    const totalLost = data.reduce((acc, curr) => acc + Number(curr.ejemplares_perdidos), 0);

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Inventory Health</h1>
                <p className="text-gray-500 mt-1">Stock availability and loss prevention metrics by category.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KPICard
                    title="Total Inventory Items"
                    value={totalGlobalItems}
                    icon={Package}
                />
                <KPICard
                    title="Lost Items"
                    value={totalLost}
                    description="Items marked as lost across all categories"
                    icon={Package}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Category Breakdown</h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-center">Total Items</TableHead>
                            <TableHead className="text-center">Available</TableHead>
                            <TableHead className="text-center">Borrowed</TableHead>
                            <TableHead className="text-center">Lost</TableHead>
                            <TableHead className="text-right">Availability %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((cat, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{cat.categoria}</TableCell>
                                <TableCell className="text-center">{cat.total_ejemplares}</TableCell>
                                <TableCell className="text-center text-green-600">{cat.ejemplares_disponibles}</TableCell>
                                <TableCell className="text-center text-blue-600">{cat.ejemplares_prestados}</TableCell>
                                <TableCell className="text-center text-red-600">{cat.ejemplares_perdidos}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: `${cat.porcentaje_disponibles}%` }}
                                            />
                                        </div>
                                        <span>{Number(cat.porcentaje_disponibles).toFixed(1)}%</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
