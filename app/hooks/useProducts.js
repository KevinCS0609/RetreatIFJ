"use client";

import { useState, useEffect } from 'react';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil semua produk
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/products');
            const result = await response.json();
            
            if (result.success) {
                setProducts(result.data);
            } else {
                setError(result.message || 'Gagal mengambil data produk');
            }
        } catch (error) {
            setError('Terjadi kesalahan saat mengambil data');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk menambah produk
    const addProduct = async (productData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result.success) {
                // Refresh data setelah menambah produk
                await fetchProducts();
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Gagal menambah produk');
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'Terjadi kesalahan saat menambah produk';
            setError(errorMessage);
            console.error('Error adding product:', error);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        refetch: fetchProducts
    };
};