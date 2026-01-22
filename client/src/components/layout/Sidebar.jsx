import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
    const navItems = [
        { icon: Briefcase, label: 'Find Jobs', href: '/jobs' },
        { icon: LayoutDashboard, label: 'Applications', href: '/applications' },
        // { icon: FileText, label: 'My Resume', href: '/resume' }, // Future
        // { icon: Settings, label: 'Settings', href: '/settings' }, // Future
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
            <div className="flex h-14 items-center border-b border-gray-200 px-6">
                <span className="text-lg font-bold text-indigo-600">JobTracker.ai</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            )
                        }
                    >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
