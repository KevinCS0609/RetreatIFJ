"use client"

import { useEffect, useState } from "react";
import ItemCard from "../_components/ItemCard";

export default function Catalog(){
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ItemMakanan, setItemMakanan] = useState([]);
    const [ItemMinuman, setItemMinuman] = useState([]);

    console.log(ItemMakanan);

    useEffect(() => {
        async function getData(){
            try{
                const res = await fetch("http://localhost:3001/item");
                const data = await res.json();
                setItemMakanan(data.filter(item => item.kategori === "Makanan"));
                setItemMinuman(data.filter(item => item.kategori === "Minuman"));
            }catch(err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    if (loading) {
        return <div className="p-5 text-center">Loading...</div>;
    }
    return (
        <div className="p-5 shadow-md rounded-md mt-5 bg-gray-100">
            <div className="mb-3 flex justify-end pr-7 border-b-2 pb-3">
                <button className="p-2 rounded-md px-4 text-sm text-white font-semibold bg-green-500 hover:scale-105 duration-300">Add Product</button>
            </div>
            <div className="my-3">
                <p className="font-semibold text-2xl">Foods</p>
            </div>
            <div className="grid grid-cols-6 gap-5">
                {ItemMakanan.map((item) => {
                    return (
                        <div key={item.id}>
                            <ItemCard item={item}/>
                        </div>
                    )
                })}
            </div>
            <div className="my-3">
                <p className="font-semibold text-2xl">Drinks</p>
            </div>
            <div className="grid grid-cols-6 gap-5">
                {ItemMinuman.map((item) => {
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