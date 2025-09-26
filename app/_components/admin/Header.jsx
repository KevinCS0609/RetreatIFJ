"use client";

import { FaBars, FaUserCircle } from 'react-icons/fa';

export default function Header({ pageTitle, setSidebarOpen, userName }) {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
            <div className="flex items-center">
                {/* Tombol Hamburger untuk Mobile */}
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none md:hidden">
                    <FaBars className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-700 ml-4 md:ml-0">{pageTitle}</h1>
            </div>

            <div className="flex items-center">
                {/* Placeholder untuk profil user */}
                <button className="flex items-center text-gray-600 focus:outline-none">
                    <FaUserCircle className="h-6 w-6" />
                    <span className="hidden md:inline-block ml-2">{userName ? userName.toUpperCase() : ''}</span>
                </button>
            </div>
        </header>
    );
}