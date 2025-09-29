import { useEffect, useState } from "react";
import { useProducts } from '../../../hooks/useProducts';

export default function ProductsContent() {
    const { products, loading, error, fetchProducts, addProduct } = useProducts();
    const [showAddForm, setShowAddForm] = useState(false);

    // Ambil data saat komponen dimount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Form data untuk produk baru
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await addProduct(formData);
        
        if (result.success) {
            // Reset form dan tutup modal
            setFormData({
                name: '',
                price: '',
                stock: '',
                category: '',
                description: ''
            });
            setShowAddForm(false);
            alert('Produk berhasil ditambahkan!');
        } else {
            alert(result.message);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Products</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Tambah Produk
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Tabel Products */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Nama Produk</th>
                            <th className="py-3 px-4 text-left">Harga</th>
                            <th className="py-3 px-4 text-left">Stok</th>
                            <th className="py-3 px-4 text-left">Kategori</th>
                            <th className="py-3 px-4 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 px-4 text-center">
                                    Belum ada produk
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{product.name}</td>
                                    <td className="py-3 px-4">Rp {product.price.toLocaleString()}</td>
                                    <td className="py-3 px-4">{product.stock}</td>
                                    <td className="py-3 px-4">{product.category}</td>
                                    <td className="py-3 px-4">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                        <a href="#" className="text-red-600 hover:text-red-900 ml-4">Delete</a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form Tambah Produk */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Tambah Produk Baru</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Nama Produk</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Harga</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Stok</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Kategori</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    // return (
    //     <div>
    //         <div className="flex justify-between items-center mb-6">
    //             <h2 className="text-2xl font-semibold text-gray-800">Manage Products</h2>
    //             <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50">
    //                 Add New Product
    //             </button>
    //         </div>
            
    //         {/* Tabel Data */}
    //         <div className="bg-white rounded-lg shadow-md overflow-hidden">
    //             <div className="overflow-x-auto">
    //                 <table className="min-w-full divide-y divide-gray-200">
    //                     <thead className="bg-gray-50">
    //                         <tr>
    //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
    //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
    //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
    //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
    //                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody className="bg-white divide-y divide-gray-200">
    //                         {products.map((product) => (
    //                             <tr key={product.id} className="hover:bg-gray-50">
    //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
    //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
    //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
    //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
    //                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    //                                     <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
    //                                     <a href="#" className="text-red-600 hover:text-red-900 ml-4">Delete</a>
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     </div>
    // );
}