"use client";

import React, { useEffect, useState } from "react";
// Mengimpor lebih banyak ikon untuk memperkaya UI
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  DollarSign,
  Home,
  LogOut,
  Settings
} from "lucide-react";

const mainNavItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "catalog", label: "Katalog Produk", icon: Package },
  { id: "transactions", label: "Transaksi", icon: ShoppingCart },
  { id: "expenses", label: "Pengeluaran", icon: DollarSign },
];

const bottomNavItems = [
    { id: "settings", label: "Pengaturan", icon: Settings },
    { id: "logout", label: "Keluar", icon: LogOut },
]

const NavItem = ({ item, isActive, isCollapsed, onClick }) => {
  const { id, label, icon: Icon } = item;
  return (
    <li className="mb-1">
      <button
        onClick={onClick}
        className={`
          group relative flex items-center w-full h-11 px-3.5 rounded-lg
          transition-colors duration-200 ease-in-out
          ${isActive
            ? "bg-emerald-600 text-white shadow-md"
            : "text-gray-300 hover:bg-slate-800 hover:text-white"
          }
        `}
      >
        <Icon className="shrink-0 h-5 w-5" />
        <span
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isCollapsed ? "w-0 ml-0" : "w-full ml-4"}
          `}
        >
          {label}
        </span>

        {/* Tooltip saat sidebar ditutup */}
        {isCollapsed && (
          <div className="
            absolute left-full ml-4 px-2 py-1.5 rounded-md
            bg-slate-900 text-white text-xs whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
            shadow-lg border border-slate-700
          ">
            {label}
          </div>
        )}
      </button>
    </li>
  );
};

export default function CashierSidebar({
  activePage = "dashboard",
  setActivePage = () => {},
  sidebarOpen = false,
  setSidebarOpen = () => {},
  onLogout,
}) {
  const [isCollapsed, setCollapsed] = useState(false);

  // Tutup drawer mobile saat layar >= md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);


  // INI MASIH SALAH HARUSNYA GAK DISINI
  const handleNavigation = async (id) => {
    if (id === "logout") {
      try {
        if (onLogout) {
          await onLogout();
        } else {
          await fetch("/api/logout", { method: "POST" });
          // jika Anda masih menyimpan token di localStorage, bersihkan juga
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch {
        window.location.href = "/login";
      }
      return;
    }

    setActivePage(id);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const sidebarWidthClass = isCollapsed ? "md:w-[72px]" : "md:w-56";

  return (
    <>
      {/* Top bar (mobile)
      <div className="md:hidden sticky top-0 z-40 bg-white border-b flex items-center justify-between h-14 px-4">
        <button
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <span className="font-bold text-lg text-emerald-700">Kasir</span>
        <div className="w-8" />
      </div> */}

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out
          ${sidebarWidthClass} ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-700 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "md:justify-center md:w-full" : ""}`}>
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-lg font-bold shrink-0">
              K
            </div>
            <span className={`font-bold text-lg whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
              Kasir
            </span>
          </div>

          {/* Collapse (desktop) */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:flex p-2 rounded-md hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Close (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activePage === item.id}
                isCollapsed={isCollapsed}
                onClick={() => handleNavigation(item.id)}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-slate-700">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activePage === item.id}
                isCollapsed={isCollapsed}
                onClick={() => handleNavigation(item.id)}
              />
            ))}
          </ul>
        </div>
      </aside>

      {/* Spacer untuk konten (desktop) */}
      <div className={`hidden ${sidebarWidthClass} shrink-0 transition-all duration-300 ease-in-out`} />
    </>
  );
}