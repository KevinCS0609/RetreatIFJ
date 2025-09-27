"use client";

import { useState, useEffect } from "react";
import CashierSidebar from "./CashierSidebar";

import CatalogContent from "./content/CatalogContent";
import DashboardContent from "./content/DashboardContent";
import TransactionContent from "./content/TransactionContent";
import ExpensesContent from "./content/ExpensesContent";
import Header from "../admin/Header";

export default function CashierLayout({ user }) {
  const [activePage, setActivePage] = useState("transactions"); // sementara untuk testing
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (activePage !== "catalog") return;

    let cancelled = false;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setFetchError("");
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data produk");
        }
        const normalized = (data.data || []).map((p) => ({
          id: p._id?.toString?.() ?? p.id,
          name: p.name,
          stock: Number(p.stock || 0),
          price: Number(p.price) || 0,
          image:
            p.image ||
            `https://via.placeholder.com/150/eeeeee/000000?Text=${encodeURIComponent(
              p.name || "Produk"
            )}`,
        }));
        if (!cancelled) setProducts(normalized);
      } catch (e) {
        if (!cancelled) setFetchError(e.message || "Terjadi kesalahan");
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "transactions") return;

    let cancelled = false;
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      setFetchError("");
      try {
        const res = await fetch("/api/transactions", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data transaksi");
        }
        const normalized = (data.data || []).map((t) => ({
          id: t.id,
          customerName: t.customerName,
          items: t.items,
          subtotal: t.subtotal,
          total: t.total,
          paymentMethod: t.paymentMethod,
          paymentStatus: t.paymentStatus,
        }));
        if (!cancelled) setTransactions(normalized);
      } catch (e) {
        if (!cancelled) setFetchError(e.message || "Terjadi kesalahan");
      } finally {
        if (!cancelled) setLoadingTransactions(false);
      }
    };

    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "catalog":
        return (
          <>
            {loadingProducts && (
              <div className="text-gray-600">Memuat produk...</div>
            )}
            {fetchError && (
              <div className="text-red-600">Error: {fetchError}</div>
            )}
            {!loadingProducts && !fetchError && (
              <CatalogContent products={products} />
            )}
          </>
        );
      case "transactions":
        return (
          <>
            {loadingTransactions && (
              <div className="text-gray-600">Memuat transaksi...</div>
            )}
            {fetchError && (
              <div className="text-red-600">Error: {fetchError}</div>
            )}
            {!loadingTransactions && !fetchError && (
              <TransactionContent transactions={transactions} />
            )}
          </>
        );
      case "expenses":
        return <ExpensesContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CashierSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          pageTitle={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          // setSidebarOpen={setSidebarOpen}
          userName={user.username}
        />

        <main className="flex-1 p-2 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
