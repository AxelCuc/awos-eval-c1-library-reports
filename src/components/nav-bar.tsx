import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export function NavBar() {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800">
                    <LayoutDashboard className="w-6 h-6 text-blue-600" />
                    <span>LibraryReports</span>
                </Link>
                <div className="flex space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
