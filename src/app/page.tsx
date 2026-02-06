import Link from 'next/link';
import { BookOpen, AlertCircle, Banknote, Users, Package } from 'lucide-react';

const reports = [
  {
    title: 'Most Borrowed Books',
    description: 'Ranking of books by popularity.',
    href: '/reports/most-borrowed',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    title: 'Overdue Loans',
    description: 'Active overdue loans and simulated fines.',
    href: '/reports/overdue-loans',
    icon: AlertCircle,
    color: 'bg-red-500',
  },
  {
    title: 'Fines Summary',
    description: 'Monthly breakdown of paid vs pending fines.',
    href: '/reports/fines-summary',
    icon: Banknote,
    color: 'bg-amber-500',
  },
  {
    title: 'Member Activity',
    description: 'User activity and delinquency rates.',
    href: '/reports/member-activity',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Inventory Health',
    description: 'Stock status by category.',
    href: '/reports/inventory-health',
    icon: Package,
    color: 'bg-emerald-500',
  },
];

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Library Insights Dashboard</h1>
      <p className="text-xl text-gray-600 mb-12">
        Welcome to the library reporting system. Select a report below to view detailed insights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={report.href}
              className="block group relative overflow-hidden rounded-xl border bg-white p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity rounded-bl-xl ${report.color}`}
              >
                <Icon className="w-16 h-16 text-current" />
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-full text-white ${report.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{report.title}</h2>
              </div>

              <p className="text-gray-600">{report.description}</p>

              <div className="mt-4 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Report &rarr;
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
