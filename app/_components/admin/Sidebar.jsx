"use client";

import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaTimes } from 'react-icons/fa';

// Navigasi item bisa dibuat dalam bentuk array agar lebih mudah dikelola
const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'products', label: 'Products', icon: FaBoxOpen },
    { id: 'transactions', label: 'Transactions', icon: FaShoppingCart },
    { id: 'users', label: 'Users', icon: FaUsers },
];

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
    
    const handleNavClick = (page) => {
        setActivePage(page);
        // Otomatis tutup sidebar di mobile setelah item di-klik
        if(sidebarOpen) {
            setSidebarOpen(false);
        }
    }

    return (
        <>
            {/* Sidebar untuk Desktop */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 bg-gray-800">
                    <div className="h-16 flex items-center justify-center text-white text-2xl font-bold border-b border-gray-700">
                        POS System
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`flex items-center px-4 py-2.5 w-full text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    activePage === item.id
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Sidebar untuk Mobile (Overlay) */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <aside 
                className={`fixed top-0 left-0 h-full bg-gray-800 w-64 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                 <div className="h-16 flex items-center justify-between px-4 text-white text-2xl font-bold border-b border-gray-700">
                    <span>POS System</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-300 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center px-4 py-2.5 w-full text-sm font-medium rounded-lg transition-colors duration-200 ${
                                activePage === item.id
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}