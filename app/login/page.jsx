"use client"

import { useEffect, useRef, useState } from "react";
import {useForm} from 'react-hook-form';
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const router = useRouter();
    const [data, setData] = useState({
        email : "",
        password : ""
    })

    const setOnChange = (field, value) => {
        setData({...data, [field] : value})
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(data.email === "admin" && data.password === "admin"){
            router.push("/admin");
        }
        else{
            router.push("/user");
        }
    }

    return (
        <>
            <div className="w-full min-h-screen flex justify-center">
                <div className="w-full min-h-screen flex-row flex justify-center items-center bg-[url(/istts.png)] bg-no-repeat bg-cover">
                    <div className="w-1/3 h-96 bg-gray-200/40 rounded-lg grid-rows-3 justify-center items-center">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="flex justify-center py-5 mt-3">
                                <p className="text-black font-bold text-3xl">Retreat IFJ</p>
                            </div>
                            <div className="flex justify-center py-5 px-6 flex-col gap-2">
                                <label htmlFor="email" className="text-black">Email</label>
                                <input 
                                    type="text" 
                                    id="email" 
                                    placeholder="Masukkan Email"
                                    value={data.email}
                                    onChange={(e) => setOnChange("email", e.target.value)}
                                    className="bg-white placeholder-gray-300 text-black focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm" />
                            </div>
                            <div className="flex justify-center px-6 flex-col mb-5 gap-2">
                                <label htmlFor="password" className="text-black">Password</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    value={data.password} 
                                    onChange={(e) => setOnChange("password", e.target.value)}
                                    placeholder="Masukkan password"
                                    className="bg-white placeholder-gray-300 text-black focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm" />
                            </div>
                            <div className="flex justify-center py-5">
                                <input
                                    type="submit" 
                                    className="bg-green-600 rounded-lg text-white font-bold py-2 hover:bg-green-700 duration-300 px-10 disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={ !data.password || !data.email ? true : false }
                                    value={"Login"}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}