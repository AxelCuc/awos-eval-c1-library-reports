import { getMemberActivity } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { KPICard } from '@/components/ui/kpi-card';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemberActivityPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 10;

    const { data, metadata } = await getMemberActivity(currentPage, limit);

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Actividad de Miembros</h1>
                <p className="text-gray-500 mt-1">Analice la participación de los miembros y la morosidad en los préstamos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KPICard
                    title="Miembros Activos"
                    value={metadata.total} // Approximate based on records returned
                    icon={Users}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Lista de Miembros</h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre del Miembro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-center">Total de Préstamos</TableHead>
                            <TableHead className="text-center">Préstamos Vencidos</TableHead>
                            <TableHead className="text-right">Tasa de Morosidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((member) => (
                            <TableRow key={member.socio_id}>
                                <TableCell className="font-medium">{member.socio}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {member.tipo_socio}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">{member.total_prestamos}</TableCell>
                                <TableCell className="text-center">{member.prestamos_vencidos}</TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-medium ${Number(member.tasa_atraso) > 20 ? 'text-red-600' : 'text-green-600'}`}>
                                        {Number(member.tasa_atraso).toFixed(1)}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-gray-200">
                    <Pagination totalPages={metadata.totalPages} />
                </div>
            </div>
        </div>
    );
}
