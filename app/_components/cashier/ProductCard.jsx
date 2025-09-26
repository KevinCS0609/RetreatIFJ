export default function ProductCard({ product, onAddToCart }) {
    return (
        <div 
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer p-4 flex flex-col items-center text-center"
            onClick={() => onAddToCart(product)}
        >
            <img src={product.image} alt={product.name} className="w-28 h-28 object-cover mb-4" />
            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-gray-600 font-bold">${product.price.toFixed(2)}</p>
        </div>
    );
}