"use client";

import { useState, useEffect } from "react";
import CashierSidebar from "../../_components/cashier/CashierSidebar";
import ProductCatalog from "../../_components/cashier/ProductCatalog";
// import OrderSummary from "./_components/OrderSummary";

// --- DATA DUMMY (nantinya ini akan diambil dari API) ---
const DUMMY_PRODUCTS = [
    { id: 1, name: 'Big Mac', price: 1.99, image: 'https://via.placeholder.com/150/FFC0CB/000000?Text=Big+Mac' },
    { id: 2, name: 'Big Burg', price: 2.69, image: 'https://via.placeholder.com/150/ADD8E6/000000?Text=Big+Burg' },
    { id: 3, name: 'Double big', price: 3.21, image: 'https://via.placeholder.com/150/90EE90/000000?Text=Double+big' },
    { id: 4, name: 'Origin Burger', price: 0.99, image: 'https://via.placeholder.com/150/FFFF00/000000?Text=Origin' },
    { id: 5, name: 'Large cheese', price: 2.11, image: 'https://via.placeholder.com/150/FFD700/000000?Text=Large+Cheese' },
    { id: 6, name: 'Small Burger', price: 0.23, image: 'https://via.placeholder.com/150/E6E6FA/000000?Text=Small+Burger' },
    { id: 7, name: 'Vegetable', price: 2.11, image: 'https://via.placeholder.com/150/32CD32/000000?Text=Vegetable' },
    { id: 8, name: 'Triple cheese', price: 5.21, image: 'https://via.placeholder.com/150/FFA500/000000?Text=Triple+Cheese' },
];
// --------------------------------------------------------


export default function CashierPage() {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const TAX_RATE = 0.10; // Pajak 10%

    // Fungsi untuk menambah produk ke keranjang
    const handleAddToCart = (product) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                // Jika item sudah ada, tambah quantity-nya
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Jika item baru, tambahkan ke keranjang dengan quantity 1
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };
    
    // Fungsi untuk mengubah jumlah item di keranjang
    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            // Hapus item jika quantity 0 atau kurang
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    // useEffect untuk menghitung ulang total setiap kali keranjang berubah
    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newTax = newSubtotal * TAX_RATE;
        const newTotal = newSubtotal + newTax;
        
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newTotal);
    }, [cartItems]);


    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <CashierSidebar />
            
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <ProductCatalog products={DUMMY_PRODUCTS} onAddToCart={handleAddToCart} />
            </main>

            {/* <OrderSummary 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                subtotal={subtotal}
                tax={tax}
                total={total}
            /> */}
        </div>
    );
}



// "use client"

// import Catalog from "../../_page/Catalog";
// import { useState } from "react";
// import Checkout from "../../_page/Checkout";
// import Transaction from "../../_page/Transaction";

// export default function UserPage(){
//     const [page, setPage] = useState();

//     return (
//         <div className="p-5 bg-gray-200 min-h-screen">
//             <div className="flex justify-between grid grid-cols-5 gap-3">
//                 <button className="rounded-md p-2 bg-white" onClick={() => setPage(1)}>Products</button>
//                 <button className="rounded-md p-2 bg-white" onClick={() => setPage(2)}>Checkout</button>
//                 <button className="rounded-md p-2 bg-white" onClick={() => setPage(3)}>Transaction</button>
//                 <button className="rounded-md p-2 bg-white">Halo</button>
//                 <button className="rounded-md p-2 bg-white">Halo</button>
//             </div>
//             <div className="mt-5">
//                 {page === 1 && (
//                     <Catalog />
//                 )}
//                 {page === 2 && (
//                     <Checkout />
//                 )}
//                 {page === 3 && (
//                     <Transaction />
//                 )}
//             </div>
//         </div>
//     )
// }