"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  MinusCircle,
  Trash2,
  User,
  ShoppingBag,
  Search,
} from "lucide-react";

// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen untuk satu kartu produk
const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-emerald-600 font-bold text-sm mb-2">
          {formatCurrency(product.price)}
        </p>
        <p
          className={`text-sm mb-3 ${
            isOutOfStock ? "text-red-500" : "text-gray-500"
          }`}
        >
          Stok: {Number(product.stock || 0)}
          {isOutOfStock && " (Habis)"}
        </p>
        <div className="mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            <PlusCircle size={16} />
            <span>{isOutOfStock ? "Habis" : "Tambah"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CatalogContent({ products = [] }) {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [localProducts, setLocalProducts] = useState(products);

  // Function untuk menambah produk ke keranjang
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Function untuk update quantity item di keranjang
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Function untuk remove item dari keranjang
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Function untuk clear seluruh keranjang
  const handleClearCart = () => {
    setCart([]);
  };

  // Sync products saat props berubah
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Function untuk update stock lokal
  const updateLocalStock = (cartItems) => {
    setLocalProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cartItems.find((item) => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - cartItem.quantity),
          };
        }
        return product;
      })
    );
  };

  // Function untuk proses transaksi
  const handleProcessTransaction = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    if (!customerName.trim()) {
      alert("Nama pelanggan harus diisi!");
      return;
    }

    setIsProcessing(true);

    try {
      const transactionData = {
        customerName: customerName.trim(),
        items: cart,
        subtotal,
        total: subtotal,
        paymentMethod,
        timestamp: new Date(),
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memproses transaksi");
      }

      updateLocalStock(cart);

      alert(`Transaksi berhasil! ID: ${result.transactionId}`);
      setCart([]);
      setCustomerName("");
      setPaymentMethod("Cash");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter produk berdasarkan search term
  const filteredProducts =
    localProducts?.filter((product) =>
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Hitung total items dan subtotal
  const { totalItems, subtotal } = useMemo(() => {
    let totalItems = 0;
    let subtotal = 0;
    cart.forEach((item) => {
      totalItems += item.quantity;
      subtotal += (item.price || 0) * item.quantity;
    });
    return { totalItems, subtotal };
  }, [cart]);

  // Jika tidak ada produk
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-4 lg:p-6">
        <div className="text-center text-gray-500 py-20">
          <ShoppingBag className="mx-auto mb-4 text-gray-400" size={60} />
          <h2 className="text-xl font-semibold mb-2">
            Belum ada produk tersedia
          </h2>
          <p>Produk akan muncul di sini setelah ditambahkan oleh admin</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
        {/* Kolom Kiri: Daftar Produk */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Katalog Produk
            </h1>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <Search className="mx-auto mb-2 text-gray-400" size={40} />
              Tidak ada produk yang sesuai dengan pencarian "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Keranjang Belanja */}
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Keranjang</h2>
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Kosongkan
                </button>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Nama Pelanggan
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama pelanggan..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* dropdown untuk metode pembayaran */}
            <div className="mb-4">
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Metode Pembayaran
              </label>
              <div className="relative">
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
                >
                  <option value="Cash">💵 Cash</option>
                  <option value="Transfer">🏦 Transfer Bank</option>
                  <option value="E-Wallet">
                    📱 E-Wallet (OVO, GoPay, DANA)
                  </option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Daftar Item di Keranjang */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <ShoppingBag
                    className="mx-auto mb-2 text-gray-400"
                    size={40}
                  />
                  Keranjang masih kosong
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="text-gray-500 hover:text-red-600 p-1"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <span className="font-semibold w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-emerald-600 p-1"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 mt-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Belanja */}
            {cart.length > 0 && (
              <div className="mt-6 border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-800 font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <button
                  onClick={handleProcessTransaction}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 text-white font-bold py-3 mt-4 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                >
                  {isProcessing ? "Memproses..." : "Proses Transaksi"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
