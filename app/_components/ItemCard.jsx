export default function ItemCard({item}){
    return (
        <>
            <div>
                <div className="border border-gray-300 rounded-lg overflow-hidden hover:scale-105 duration-300">
                    <img src="../favicon.ico" alt={item.name} className="w-full h-48 object-cover"/>
                    <div>
                        <div className="p-3">
                            <h2 className="font-semibold text-lg">{item.name}</h2>
                            <p className="text-gray-600">${item.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};