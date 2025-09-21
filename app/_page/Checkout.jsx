"use client"

import { FaCartShopping } from "react-icons/fa6";


import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Modal from "../_components/_modal/Modal";

export default function Checkout(){
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [formData, setFormData] = useState({
        subtotal: '',
        deskripsi: ''
    });

    useEffect(() => {
        async function getProducts(){
            try{
                const res = await fetch("http://localhost:3001/item");
                const data = await res.json();
                setProducts(data);
            }catch(err){
                console.log(err);
            }
        }

        async function getTransactions(){
            try{
                const res = await fetch("http://localhost:3001/transaction");
                const data = await res.json();
                setTransactions(data);
            }catch(err){
                console.log(err);
            }
        }
        
        getProducts();
        getTransactions();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        
        // Swal.fire({
        //     title: 'Added to Cart!',
        //     text: `${product.name} has been added to your cart`,
        //     icon: 'success',
        //     timer: 1500,
        //     showConfirmButton: false
        // });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch("http://localhost:3001/transaction", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    subtotal: getTotalPrice()
                })
            });

            if (res.ok) {
                const updatedRes = await fetch("http://localhost:3001/transaction");
                const updatedData = await updatedRes.json();
                setTransactions(updatedData);
                
                setCart([]);
                setFormData({ subtotal: '', deskripsi: '' });
                setOpenAddModal(false);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'Transaction completed successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to complete transaction',
                icon: 'error'
            });
        }
    };

    const closeModal = () => {
        setOpenAddModal(false);
        setFormData({ 
            subtotal: getTotalPrice(), 
            deskripsi: `Purchase of ${getTotalItems()} items` 
        });
    };

    const openCheckoutModal = () => {
        if (cart.length === 0) {
            Swal.fire({
                title: 'Cart Empty',
                text: 'Please add items to cart before checkout',
                icon: 'warning'
            });
            return;
        }
        setFormData({ 
            subtotal: getTotalPrice(), 
            deskripsi: `Purchase of ${getTotalItems()} items` 
        });
        setOpenAddModal(true);
    };

    return (
        <>
        <div className="p-5 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Select products and add them to your cart</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-20">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-gray-400 text-4xl"></div>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-green-600">
                                Rp {product.price?.toLocaleString() || 'N/A'}
                            </span>
                            <button
                                onClick={() => addToCart(product)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <FaCartShopping />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table
            <div className="bg-white shadow-md rounded-lg p-6 mb-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b-2 border-gray-300">
                            <tr className="text-left">
                                <th className="pb-3">No</th>
                                <th className="pb-3">Total</th>
                                <th className="pb-3">Description</th>
                                <th className="pb-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={transaction.id} className="border-b border-gray-300">
                                    <td className="py-3">{index + 1}</td>
                                    <td className="py-3 font-semibold text-green-600">
                                        Rp {transaction.subtotal?.toLocaleString() || 'N/A'}
                                    </td>
                                    <td className="py-3">{transaction.deskripsi}</td>
                                    <td className="py-3 text-gray-500">
                                        {new Date().toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>

        {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-[9998] p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="bg-blue-100 rounded-full px-4 py-2">
                                <span className="text-blue-800 font-semibold">
                                    {getTotalItems()} items in cart
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                Subtotal: Rp {getTotalPrice().toLocaleString()}
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setCart([])}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={openCheckoutModal}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-4 max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <span className="font-medium text-sm">{item.name}</span>
                                        <div className="text-xs text-gray-500">
                                            Rp {item.price?.toLocaleString()} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <Modal 
            show={openAddModal} 
            onClose={closeModal} 
            title="Complete Transaction"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                    </label>
                    <input
                        type="number"
                        id="subtotal"
                        value={getTotalPrice()}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600"
                    />
                </div>
                
                <div>
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter transaction description"
                        required
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm py-1">
                            <span>{item.name} x{item.quantity}</span>
                            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-semibold">
                        Total: Rp {getTotalPrice().toLocaleString()}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Complete Transaction
                    </button>
                </div>
            </form>
        </Modal>
        </>
    )
}