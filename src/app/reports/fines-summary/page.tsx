import { getFinesSummary } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICard } from '@/components/ui/kpi-card';
import { DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinesSummaryPage() {
    const data = await getFinesSummary();

    // Calculate aggregate metrics
    const totalCollected = data.reduce((acc, curr) => acc + Number(curr.monto_pagado), 0);
    const totalPending = data.reduce((acc, curr) => acc + Number(curr.monto_pendiente), 0);

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Resumen de Multas</h1>
                <p className="text-gray-500 mt-1">Resumen financiero de las multas de la biblioteca, cobradas vs pendientes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KPICard
                    title="Total Cobrado"
                    value={`$${totalCollected.toFixed(2)}`}
                    icon={DollarSign}
                />
                <KPICard
                    title="Total Pendiente"
                    value={`$${totalPending.toFixed(2)}`}
                    icon={DollarSign}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Desglose Mensual</h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mes</TableHead>
                            <TableHead className="text-center">Total de Multas Emitidas</TableHead>
                            <TableHead className="text-right">Monto Pagado</TableHead>
                            <TableHead className="text-right">Monto Pendiente</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">
                                    {new Date(row.mes).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                                </TableCell>
                                <TableCell className="text-center">{row.total_multas}</TableCell>
                                <TableCell className="text-right text-green-600">${Number(row.monto_pagado).toFixed(2)}</TableCell>
                                <TableCell className="text-right text-red-600">${Number(row.monto_pendiente).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
