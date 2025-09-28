"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  TrendingUp,
  DollarSign,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen untuk kartu statistik
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
    >
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function TransactionContent({ transactions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const ITEMS_PER_PAGE = 5;

  // Kalkulasi data untuk kartu statistik
  const stats = useMemo(() => {
    const completedTransactions = transactions.filter(
      (t) => t.paymentStatus === "Completed"
    );
    return {
      totalProductsSold: completedTransactions.reduce(
        (acc, curr) =>
          acc +
          curr.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
        0
      ),
      totalCash: completedTransactions
        .filter((t) => t.paymentMethod === "Cash")
        .reduce((acc, curr) => acc + curr.total, 0),
      totalDigital: completedTransactions
        .filter((t) => t.paymentMethod === "E-Wallet" || t.paymentMethod === "Transfer")
        .reduce((acc, curr) => acc + curr.total, 0),
      totalRevenue: completedTransactions.reduce(
        (acc, curr) => acc + curr.total,
        0
      ),
    };
  }, []);

  // Logika untuk filter dan pencarian
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filterStatus !== "All" && transaction.paymentStatus !== filterStatus)
        return false;
      if (
        filterPayment !== "All" &&
        transaction.paymentMethod !== filterPayment
      )
        return false;
      return (
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, filterStatus, filterPayment]);

  // Logika untuk pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentBadge = (method) => {
    switch (method) {
      case "Cash":
        return "bg-blue-100 text-blue-700";
      case "E-Wallet":
        return "bg-purple-100 text-purple-700";
      case "Transfer":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="flex-1 bg-gray-50 p-4">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Riwayat Transaksi
        </h1>

        {/* Bagian Atas: Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <StatCard
            icon={ShoppingBag}
            title="Produk Terjual"
            value={stats.totalProductsSold}
            color="bg-sky-500"
          />
          <StatCard
            icon={DollarSign}
            title="Total Tunai (Cash)"
            value={formatCurrency(stats.totalCash)}
            color="bg-emerald-500"
          />
          <StatCard
            icon={CreditCard}
            title="Total Digital"
            value={formatCurrency(stats.totalDigital)}
            color="bg-indigo-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Pendapatan"
            value={formatCurrency(stats.totalRevenue)}
            color="bg-amber-500"
          />
        </div>

        {/* Bagian Bawah: Tabel Riwayat Transaksi */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          {/* Kontrol Tabel: Search dan Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
            <div className="relative w-full md:w-1/3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari (ID / Nama)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <ListFilter className="text-gray-500" size={20} />
              <select
                value={filterPayment}
                onChange={(e) => {
                  setFilterPayment(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="All">Semua Pembayaran</option>
                <option value="Cash">Cash</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="Transfer">Transfer</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="All">Semua Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">ID Transaksi</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pembayaran</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {trx.id}
                    </td>
                    <td className="px-6 py-4">{trx.customerName}</td>
                    <td className="px-6 py-4">
                      {trx.items
                        .map(
                          (item) => `${item.productName} (x${item.quantity})`
                        )
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(trx.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentBadge(
                          trx.paymentMethod
                        )}`}
                      >
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          trx.paymentStatus
                        )}`}
                      >
                        {trx.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedTransactions.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Tidak ada data transaksi.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-5">
              <span className="text-sm text-gray-700">
                Halaman <span className="font-semibold">{currentPage}</span>{" "}
                dari <span className="font-semibold">{totalPages}</span>
              </span>
              <div className="inline-flex items-center -space-x-px">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
