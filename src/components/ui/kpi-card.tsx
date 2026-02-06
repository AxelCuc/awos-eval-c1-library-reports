import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ title, value, description, icon: Icon, trend }: KPICardProps) {
    return (
        <div className="rounded-xl border bg-white p-6 text-slate-950 shadow">
            <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold leading-none tracking-tight text-slate-600">{title}</h3>
                    {Icon && <Icon className="h-5 w-5 text-slate-400" />}
                </div>
            </div>
            <div className="p-0 pt-4">
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}
