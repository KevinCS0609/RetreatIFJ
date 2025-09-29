"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../_components/_admin/AdminLayout";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/me");

                if (!res.ok) {
                    console.error("Authentication failed:", res.statusText);
                    router.replace("/login");
                    return;
                }

                const data = await res.json();
                // console.log('User data from /api/me:', data);

                if (data.role !== "admin") {
                    console.warn("User is not an admin, redirecting.");
                    router.replace("/login");
                    return;
                }

                setUser(data.user);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching user data:", error);
                router.replace("/login");
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <AdminLayout user={user} />
    );
}


// "use client";

// import { useState } from "react";
// import Catalog from "../../_page/Catalog";
// import Checkout from "../../_page/Checkout";
// import Transaction from "../../_page/Transaction";

// export default function AdminPage(){

//     const [page, setPage] = useState();
//     return (
//         <>
//             <div className="p-5 bg-gray-200 min-h-screen">
//                 <div className="flex justify-between grid grid-cols-5 gap-3">
//                     <button className="rounded-md p-2 bg-white" onClick={() => setPage(1)}>Products</button>
//                     <button className="rounded-md p-2 bg-white" onClick={() => setPage(2)}>Checkout</button>
//                     <button className="rounded-md p-2 bg-white">Transaction</button>
//                     <button className="rounded-md p-2 bg-white">User</button>
//                     <button className="rounded-md p-2 bg-white">Halo</button>
//                 </div>
//             </div>
//             <div className="mt-5">
//                 {page === 1 && (
//                     <Catalog />
//                 )}
//                 {page === 2 && (
//                     <Checkout />
//                 )}
//                 {page === 3 && (
//                     <Transaction />
//                 )}
//             </div>
//         </>
//     )
// }