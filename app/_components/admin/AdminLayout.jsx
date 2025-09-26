"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './content/DashboardContent';
import ProductsContent from './content/ProductsContent';
// import TransactionsContent from './content/TransactionsContent';
// import UsersContent from './content/UsersContent';

export default function AdminLayout({ user }) {
    // State untuk menentukan halaman mana yang aktif. 'dashboard' sebagai default.
    const [activePage, setActivePage] = useState('dashboard');
    // State untuk mengontrol visibilitas sidebar di mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fungsi untuk merender konten halaman berdasarkan state 'activePage'
    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardContent />;
            case 'products':
                return <ProductsContent />;
            case 'transactions':
                return <TransactionsContent />;
            case 'users':
                return <UsersContent />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header 
                    pageTitle={activePage.charAt(0).toUpperCase() + activePage.slice(1)} 
                    setSidebarOpen={setSidebarOpen}
                    userName={user.username} // Assuming user object has a name property
                />

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}