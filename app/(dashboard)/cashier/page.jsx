"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CashierLayout from "../../_components/cashier/CashierLayout";

export default function CashierPage() {
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

        if (data.role !== "kasir") {
          console.warn("User is not a kasir, redirecting.");
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
    <div className="h-screen bg-gray-50">
      <CashierLayout user={user} />
    </div>
  );
}
