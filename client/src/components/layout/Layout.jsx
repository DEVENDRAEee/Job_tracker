import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AISidebar from './AISidebar';
import { Bot } from 'lucide-react';

export default function Layout() {
    const [isAiOpen, setIsAiOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="mx-auto max-w-7xl">
                    <Outlet />
                </div>

                {/* Floating Toggle if closed */}
                {!isAiOpen && (
                    <button
                        onClick={() => setIsAiOpen(true)}
                        className="fixed bottom-8 right-8 z-40 rounded-full bg-indigo-600 p-4 shadow-lg hover:bg-indigo-700 text-white transition-all transform hover:scale-110"
                        title="Ask AI Assistant"
                    >
                        <Bot className="h-6 w-6" />
                    </button>
                )}
            </main>

            <AISidebar isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    );
}
