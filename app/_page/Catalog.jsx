import ItemCard from "../_components/ItemCard";

async function getData(){
    try{
        const res = await fetch("http://localhost:3001/item");
        const data = await res.json();

        return data;
    }catch(err){
        console.log(err);
    }
}

export default async function Catalog(){
    const items = await getData();
    return (
        <div className="p-5 shadow-md rounded-md mt-5 bg-gray-100">
            <div className="mb-3 flex justify-end pr-7 border-b-2 pb-3">
                <button className="p-2 rounded-md px-4 text-sm text-white font-semibold bg-green-500 hover:scale-105 duration-300">Add Product</button>
            </div>
            <div className="grid grid-cols-6 gap-5">
                {items.map((item) => {
                    return (
                        <div key={item.id}>
                            <ItemCard item={item}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}