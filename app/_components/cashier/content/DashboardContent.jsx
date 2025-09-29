"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  List,
} from "lucide-react";

const MOCK_EXPENSES = [
  // { date: "2025-09-22", category: "Bahan Baku", amount: 150000 },
  // { date: "2025-09-23", category: "Gaji", amount: 0 },
  // { date: "2025-09-24", category: "Listrik & Air", amount: 50000 },
  // { date: "2025-09-25", category: "Bahan Baku", amount: 200000 },
  // { date: "2025-09-26", category: "Lainnya", amount: 25000 },
  // { date: "2025-09-27", category: "Sewa", amount: 0 },
  // { date: "2025-09-28", category: "Bahan Baku", amount: 180000 },
  // { date: "2025-09-28", category: "Promosi", amount: 75000 },
];

const MODAL_AWAL = 0; // Modal awal

// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen untuk kartu statistik utama
const StatCard = ({ title, value, icon: Icon, color, detail }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
    {detail && <p className="text-xs text-gray-400 mt-3">{detail}</p>}
  </div>
);

export default function DashboardContent({ transactions }) {
  const [filterType, setFilterType] = useState("weekly"); // 'weekly' or 'daily'
  const [selectedDate, setSelectedDate] = useState("2025-09-28"); // YYYY-MM-DD format

  const toLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const processTransactions = (transactions) => {
    if (!transactions || !Array.isArray(transactions)) return [];

    const incomeByDate = {};

    transactions.forEach((transaction) => {
      let dateStr;
      if (!transaction) return;

      // ambil string tanggal dari berbagai format
      if (transaction.createdAt && transaction.createdAt.$date) {
        dateStr = transaction.createdAt.$date;
      } else if (transaction.createdAt) {
        dateStr = transaction.createdAt;
      } else {
        console.warn("Missing createdAt:", transaction);
        return;
      }

      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid date:", dateStr);
        return;
      }

      // gunakan local date (bukan UTC) agar konsisten
      const date = toLocalDateString(dateObj);

      incomeByDate[date] = (incomeByDate[date] || 0) + (transaction.total || 0);
    });

    return Object.keys(incomeByDate)
      .sort()
      .map((date) => ({ date, amount: incomeByDate[date] }));
  };

  const {
    totalPendapatan,
    totalPengeluaran,
    keuntunganBersih,
    sisaModal,
    chartData,
    expenseData,
    dailyExpensesList,
    titleDateRange,
  } = useMemo(() => {
    const incomeData = processTransactions(transactions);

    let filteredIncome = [];
    let filteredExpenses = [];
    let titleDateRange = "minggu ini";

    if (filterType === "weekly") {
      const today = new Date(); // local time
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
      // inginkan minggu yang dimulai hari Senin:
      const startDate = new Date(today);
      startDate.setDate(
        today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      );
      startDate.setHours(0, 0, 0, 0);

      const startDateString = toLocalDateString(startDate);
      const todayString = toLocalDateString(today);

      filteredIncome = incomeData.filter(
        (i) => i.date >= startDateString && i.date <= todayString
      );
      filteredExpenses = MOCK_EXPENSES.filter(
        (e) => e.date >= startDateString && e.date <= todayString
      );

      titleDateRange = `${startDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })} - ${today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    } else {
      // 'daily'
      filteredIncome = incomeData.filter((i) => i.date === selectedDate);
      filteredExpenses = MOCK_EXPENSES.filter((e) => e.date === selectedDate);
      titleDateRange = new Date(selectedDate + "T12:00:00Z").toLocaleDateString(
        "id-ID",
        { day: "numeric", month: "long", year: "numeric" }
      );
    }

    const totalPendapatan = filteredIncome.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalPengeluaran = filteredExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const keuntunganBersih = totalPendapatan - totalPengeluaran;
    const sisaModal =
      filterType === "daily"
        ? MODAL_AWAL - totalPengeluaran
        : MODAL_AWAL - totalPengeluaran;
    const dailyExpensesList = filteredExpenses.filter((e) => e.amount > 0);

    let chartData = [];

    if (filterType === "weekly") {
      // WEEKLY: Gabungkan semua hari dalam minggu
      const combinedData = {};
      filteredIncome.forEach((item) => {
        const day = new Date(item.date + "T12:00:00Z").toLocaleDateString(
          "id-ID",
          { weekday: "short" }
        );
        if (!combinedData[day])
          combinedData[day] = { name: day, pendapatan: 0, pengeluaran: 0 };
        combinedData[day].pendapatan += item.amount;
      });
      filteredExpenses.forEach((item) => {
        const day = new Date(item.date + "T12:00:00Z").toLocaleDateString(
          "id-ID",
          { weekday: "short" }
        );
        if (!combinedData[day])
          combinedData[day] = { name: day, pendapatan: 0, pengeluaran: 0 };
        combinedData[day].pengeluaran += item.amount;
      });
      chartData = Object.values(combinedData);
    } else {
      // DAILY: Hanya data hari yang dipilih
      const dayName = new Date(selectedDate + "T12:00:00Z").toLocaleDateString(
        "id-ID",
        { weekday: "long" }
      );
      chartData = [
        {
          name: dayName,
          pendapatan: totalPendapatan,
          pengeluaran: totalPengeluaran,
        },
      ];
    }

    const expenseByCategory = filteredExpenses.reduce((acc, curr) => {
      if (curr.amount > 0)
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    const expenseData = Object.keys(expenseByCategory).map((key) => ({
      name: key,
      value: expenseByCategory[key],
    }));

    console.log("Final calculations:", {
      totalPendapatan,
      totalPengeluaran,
      keuntunganBersih,
      filterType,
      selectedDate,
    }); // Debug

    return {
      totalPendapatan,
      totalPengeluaran,
      keuntunganBersih,
      sisaModal,
      chartData,
      expenseData,
      dailyExpensesList,
      titleDateRange,
    };
  }, [filterType, selectedDate, transactions]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <main className="flex-1 bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Kasir
            </h1>
            <p className="text-gray-500">
              Ringkasan pembukuan untuk {titleDateRange}.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {filterType === "daily" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg py-1.5 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            )}
            <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setFilterType("daily")}
                className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                  filterType === "daily"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "bg-transparent text-gray-600"
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setFilterType("weekly")}
                className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                  filterType === "weekly"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "bg-transparent text-gray-600"
                }`}
              >
                Mingguan
              </button>
            </div>
          </div>
        </div>

        {/* Kartu Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <StatCard
            title="Total Pendapatan"
            value={formatCurrency(totalPendapatan)}
            icon={TrendingUp}
            color="bg-emerald-500"
          />
          <StatCard
            title="Total Pengeluaran"
            value={formatCurrency(totalPengeluaran)}
            icon={TrendingDown}
            color="bg-red-500"
          />
          <StatCard
            title="Keuntungan Bersih"
            value={formatCurrency(keuntunganBersih)}
            icon={DollarSign}
            color="bg-sky-500"
          />
          <StatCard
            title="Sisa Modal"
            value={formatCurrency(sisaModal)}
            icon={ShoppingCart}
            color="bg-amber-500"
          />
        </div>

        {/* Grafik dan Rincian */}
        <div
          className={`grid grid-cols-1 ${
            filterType === "weekly" ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-6 mb-6`}
        >
          {filterType === "weekly" && (
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="font-bold text-gray-800 mb-4">
                Aktivitas Mingguan
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" iconSize={10} />
                  <Bar
                    dataKey="pendapatan"
                    fill="#10b981"
                    name="Pendapatan"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#ef4444"
                    name="Pengeluaran"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {filterType === "daily" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-[364px] flex flex-col">
              <h2 className="font-bold text-gray-800 mb-4">
                Rincian Pengeluaran Harian
              </h2>
              <div className="flex-grow overflow-y-auto pr-2">
                {dailyExpensesList.length > 0 ? (
                  <ul className="space-y-3">
                    {dailyExpensesList.map((expense, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-600 text-sm">
                          {expense.category}
                        </span>
                        <span className="font-semibold text-red-600 text-sm">
                          {formatCurrency(expense.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <List size={40} className="mb-2" />
                    <span>Tidak ada pengeluaran.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-4">
              Kategori Pengeluaran
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              {expenseData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), name]}
                  />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Tidak ada data pengeluaran
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
