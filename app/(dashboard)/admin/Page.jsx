"use client";

import { useState } from "react";
import Catalog from "../../_page/Catalog";
import Checkout from "../../_page/Checkout";
import Transaction from "../../_page/Transaction";

export default function AdminPage(){

    const [page, setPage] = useState();
    return (
        <>
            <div className="p-5 bg-gray-200 min-h-screen">
                <div className="flex justify-between grid grid-cols-5 gap-3">
                    <button className="rounded-md p-2 bg-white" onClick={() => setPage(1)}>Products</button>
                    <button className="rounded-md p-2 bg-white" onClick={() => setPage(2)}>Checkout</button>
                    <button className="rounded-md p-2 bg-white">Transaction</button>
                    <button className="rounded-md p-2 bg-white">User</button>
                    <button className="rounded-md p-2 bg-white">Halo</button>
                </div>
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
        </>
    )
}