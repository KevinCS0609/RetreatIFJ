"use client"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Modal from "../_components/_modal/Modal";

export default function Transaction(){

    const [transactions, setTransactions] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [formData, setFormData] = useState({
        subtotal: '',
        deskripsi: ''
    });

    useEffect(() => {
        async function getData(){
            try{
                const res = await fetch("http://localhost:3001/transaction");
                const data = await res.json();
                setTransactions(data);
            }catch(err){
                console.log(err);
            }
        }
        getData();
    }, []);

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
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Refresh data
                const updatedRes = await fetch("http://localhost:3001/transaction");
                const updatedData = await updatedRes.json();
                setTransactions(updatedData);
                
                // Reset form and close modal
                setFormData({ subtotal: '', deskripsi: '' });
                setOpenAddModal(false);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'Transaction added successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add transaction',
                icon: 'error'
            });
        }
    };

    const closeModal = () => {
        setOpenAddModal(false);
        setFormData({ subtotal: '', deskripsi: '' });
    };

    return (
        <>
        <div className="p-5 shadow-md rounded-md mt-5 bg-gray-100">
            {/* <div className="mb-3 flex justify-end pr-7 border-b-2 pb-3">
                <button className="p-2 rounded-md px-4 text-sm text-white font-semibold bg-green-500 hover:scale-105 duration-300" onClick={() => setOpenAddModal(true)}>New Transaction</button>
            </div> */}
            <div className="mt-5 overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b-2 border-gray-300">
                        <tr className="text-left">
                            <th className="pb-3">No</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Description</th>
                            <th className="pb-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={transaction.id} className="border-b border-gray-300">
                                <td className="py-3 ">{index + 1}</td>
                                <td className="">{transaction.subtotal}</td>
                                <td className="">{transaction.deskripsi}</td>
                            </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <Modal 
            show={openAddModal} 
            onClose={closeModal} 
            title="Add New Transaction"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    
                </div>
                <div>
                    <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                    </label>
                    <input
                        type="number"
                        id="subtotal"
                        value={formData.subtotal}
                        onChange={(e) => handleInputChange('subtotal', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter total amount"
                        required
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
                        Add Transaction
                    </button>
                </div>
            </form>
        </Modal>

        </>
    )
}