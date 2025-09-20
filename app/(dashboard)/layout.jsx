"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({children}){
    const route = useRouter();
    return (
        <>
            <div className="p-5 border-b border-gray-300 bg-orange-500 flex justify-between">
                <div>
                    <p className="text-white font-semibold text-xl">
                        Welcome, 
                    </p>
                </div>
                <div>
                    <button className="bg-white text-black px-3 py-1 rounded-lg font-semibold hover:bg-gray-200 duration-300" onClick={route.push("/login")}>Logout</button>
                </div>
            </div>
            <div>
                {children}
            </div>
        </>
    )
}