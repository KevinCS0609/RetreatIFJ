import { FaSearch, FaFilter } from 'react-icons/fa';
import ProductCard from './ProductCard';

export default function ProductCatalog({ products, onAddToCart }) {
    return (
        <div className="w-full">
            {/* Header & Search */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-400" />
                    </span>
                    <input 
                        type="text"
                        placeholder="Search menu..."
                        className="w-full md:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                {/* Opsi filter bisa ditambahkan di sini */}
            </div>

            {/* Breadcrumb & Title */}
            <div className="mb-6">
                <p className="text-sm text-gray-500">MENUS &gt; FOOD &gt;</p>
                <h2 className="text-3xl font-bold text-gray-800">Hamburger</h2>
                <p className="text-gray-500">Discover whatever you need easily</p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map(product => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </div>
    );
}