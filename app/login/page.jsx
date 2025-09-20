"use client"

import { useEffect, useRef } from "react";
import {useForm} from 'react-hook-form';

export default function LoginPage(){
    const {register, handleSubmit} = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    return (
        <>
            <div className="w-full min-h-screen flex justify-center">
                <div className="w-3/3 min-h-screen flex-row flex justify-center items-center">
                    <div className="w-1/3 h-96 bg-white rounded-lg grid-rows-3 justify-center items-center">
                        <div className="flex justify-center py-5 mt-3">
                            <p className="text-black font-bold text-3xl">Retreat IFJ</p>
                        </div>
                        <div className="flex justify-center py-5 px-6 flex-col gap-2">
                            <label htmlFor="email" className="text-black">Email</label>
                            <input 
                                type="text" 
                                name="email" 
                                id="email" 
                                placeholder="Masukkan Email"
                                value={register.email}
                                className="placeholder-gray-300 focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm" />
                        </div>
                        <div className="flex justify-center px-6 flex-col mb-5 gap-2">
                            <label htmlFor="password" className="text-black">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                value={register.password} 
                                placeholder="Masukkan password"
                                className="placeholder-gray-300 focus:placeholder-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 px-3 w-full text-sm" />
                        </div>
                        <div className="flex justify-center py-5">
                            <button 
                                className="bg-green-600 rounded-lg text-white font-bold py-2 hover:bg-green-700 duration-300 px-10 disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={ !register.password || !register.email ? true : false }
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}