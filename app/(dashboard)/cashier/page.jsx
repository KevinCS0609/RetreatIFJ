"use client"

import Catalog from "../../_page/Catalog";
import { useState } from "react";
import Checkout from "../../_page/Checkout";
import Transaction from "../../_page/Transaction";

export default function UserPage(){
    const [page, setPage] = useState();

    return (
        <div className="p-5 bg-gray-200 min-h-screen">
            <div className="flex justify-between grid grid-cols-5 gap-3">
                <button className="rounded-md p-2 bg-white" onClick={() => setPage(1)}>Products</button>
                <button className="rounded-md p-2 bg-white" onClick={() => setPage(2)}>Checkout</button>
                <button className="rounded-md p-2 bg-white" onClick={() => setPage(3)}>Transaction</button>
                <button className="rounded-md p-2 bg-white">Halo</button>
                <button className="rounded-md p-2 bg-white">Halo</button>
            </div>
            <div className="mt-5">
                {page === 1 && (
                    <Catalog />
                )}
                {page === 2 && (
                    <Checkout />
                )}
                {page === 3 && (
                    <Transaction />
                )}
            </div>
        </div>
    )
}