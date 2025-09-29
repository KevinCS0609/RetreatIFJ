"use client";

import { useState, useEffect } from "react";
import CashierSidebar from "./CashierSidebar";

import CatalogContent from "./content/CatalogContent";
import DashboardContent from "./content/DashboardContent";
import TransactionContent from "./content/TransactionContent";
import ExpensesContent from "./content/ExpensesContent";
import Header from "../admin/Header";

export default function CashierLayout({ user }) {
  const [activePage, setActivePage] = useState("dashboard"); // sementara untuk testing
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Fetch products when activePage is 'catalog'
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

  // Fetch transactions when activePage is 'transactions'
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


  const LoadingCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  const LoadingGrid = ({ type, count = 6 }) => (
    <div
      className={`grid gap-4 p-6 ${
        type === "transaction"
          ? "grid-cols-1"
          : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <LoadingCard key={i} />
        ))}
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent transactions={transactions} />;
      case "catalog":
        return (
          <>
            {loadingProducts && <LoadingGrid type="product" count={8} />}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 m-6 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Error: {fetchError}</span>
                </div>
              </div>
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
              <LoadingGrid type="transaction" count={4} />
            )}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 m-6 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Error: {fetchError}</span>
                </div>
              </div>
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
