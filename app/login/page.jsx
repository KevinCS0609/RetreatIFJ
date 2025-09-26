"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.role === "admin") {
            router.replace("/admin");
          } else if (data.role === "kasir") {
            router.replace("/cashier");
          }
        }
      } catch (err) {
        console.log("Belum login atau token tidak valid:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // console.log("Login response:", data);

      if (response.ok) {
        if (data.role === "admin") {
          router.replace("/admin");
        } else if (data.role === "kasir") {
          router.replace("/cashier");
        } else {
          setError("Role tidak dikenali");
        }
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full min-h-screen flex-row flex justify-center items-center bg-[url(/istts.png)] bg-no-repeat bg-cover">
        <div className="w-1/3 h-auto bg-gray-200/40 rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center py-5 mt-3">
              <p className="text-black font-bold text-3xl">Retreat IFJ</p>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="email" className="text-black">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white placeholder-gray-300 text-black focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <label htmlFor="password" className="text-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white placeholder-gray-300 text-black focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
            )}

            <div className="flex justify-center">
              <input
                type="submit"
                className="bg-green-600 rounded-lg text-white font-bold py-2 hover:bg-green-700 duration-300 px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email || !password || isLoading}
                value="Login"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}