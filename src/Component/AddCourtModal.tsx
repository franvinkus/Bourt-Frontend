"use client"

import { getToken } from "@/utils/Auth";
import { API_URL } from "@/utils/BackEndAPI";
import { useState } from "react";

interface Props{
    isOpen: boolean,
    onClose: () => void,
    placeId: string;
}

interface Court{
    placeId: string,
    name: string, 
    number: number,
    pricePerHour: number,
}

export default function AddCourtModal({isOpen, onClose, placeId}: Props){
    if(!isOpen) return null;

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () =>{
        setIsLoading(true);
        const token = getToken();

        const cleanPrice = parseInt(pricePerHour.replace(/[^0-9]/g, ''));
        const cleanNumber = parseInt(number);

        try{
            const payload ={
                placeId: placeId,
                name: name,
                number: cleanNumber,
                pricePerHour: cleanPrice,
            }

            const response = await fetch(API_URL.COURT.InsertCourt,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if(response.ok){
                const result: Court = await response.json();
                console.log("Berhasil Hasil: \n", result);
                alert("Successfully added court");
                window.location.reload();
            }
            else{
                console.log("OH NO");
            }
        }
        catch(error){
             console.error("Network Error:", error);
        }

        setIsLoading(false);
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const rawValue = e.target.value.replace(/[^0-9]/g, '');

        if(!rawValue){
            setPricePerHour('');
            return;
        }

        const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setPricePerHour(`Rp ${formatted}`);
    }

    const handleClear = () => {
        setName('');
        setNumber('');
        setPricePerHour('');
    }

    return(
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="w-140 bg-white border-2 p-5 rounded-xl">
                <div className="flex justify-end p-2">
                    <button 
                    className="text-black text-3xl font-bold hover:cursor-pointer"
                    onClick={onClose}
                    >
                        X
                    </button>
                </div>
                    
                <h2 className="text-2xl font-bold mb-4">Add New Court</h2>

                <div className="w-full mb-4">
                    <h1 className="text-xl">Name</h1>
                    <input
                    className="w-3/4 border-2 rounded-lg p-3"
                    placeholder="Insert court name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="w-full mb-4">
                    <h1 className="text-xl">Number</h1>
                    <input
                    className="w-3/4 border-2 rounded-lg p-3 "
                    placeholder="Insert court name"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    />
                </div>

                <div className="w-full mb-4">
                    <h1 className="text-xl">Price per Hour</h1>
                    <input
                    className="w-3/4 border-2 rounded-lg p-3 "
                    placeholder="Insert court name"
                    value={pricePerHour}
                    onChange={handlePriceChange}
                    />
                </div>

                
                <div className="flex flex-row justify-between">
                    <button 
                    className="border-2 p-3 rounded-lg mt-2 text-red-600 hover:border-red-600 hover:cursor-pointer hover:bg-red-600 hover:text-white"
                    onClick={handleClear}
                    >
                        clear
                    </button>

                    <button 
                    className="border-2 p-3 rounded-lg mt-2 hover:cursor-pointer"
                    onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>

                
            </div>
        </div>
    )
}