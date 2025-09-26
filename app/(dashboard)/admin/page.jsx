"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../_components/admin/AdminLayout";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fungsi untuk mengambil data user dari token
        const getUserFromToken = () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    // Jika tidak ada token, redirect ke login
                    router.push("/login");
                    return;
                }

                // Decode JWT token (tanpa verifikasi - hanya untuk mendapatkan payload)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(function(c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        })
                        .join('')
                );

                const userData = JSON.parse(jsonPayload);
                console.log('User data from token:', userData);
                
                
                // Periksa apakah token sudah expired
                const currentTime = Date.now() / 1000;
                if (userData.exp < currentTime) {
                    // Token expired, redirect ke login
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                // Periksa apakah user adalah admin
                if (userData.role !== "admin") {
                    router.push("/login");
                    return;
                }

                setUser(userData);
                setLoading(false);

            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
                router.push("/login");
            }
        };

        getUserFromToken();
    }, [router]);

    // Tampilkan loading saat masih memproses
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Jika user tidak ada, tidak menampilkan apapun (akan redirect)
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