"use client"

import { getUserName, isLoggedIn } from "@/utils/Auth";
import { useEffect, useState } from "react";

export default function Navbar(){

    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsLogged(isLoggedIn());
        setUsername(getUserName());
    }, []);

    const handleModal = () =>{
        setShowModal(!showModal);
    }

    return(
      <div className="bg-white hover:bg-gray-200">
        <div className="flex flex-row justify-center items-center align-middle p-3 h-20">
            <div className="flex-1 flex pl-10">
                <p className="text-3xl">Bourt</p>
            </div>

            <div className="flex justify-between items-center text-xl gap-15">
                <a 
                className="hover:cursor-pointer" 
                href="../homepage"
                >
                    Home
                </a>
                
                <a 
                className="hover:cursor-pointer"
                href={`${isLogged ? "" : "../login"}`}
                >
                    My Bookings
                </a>
            </div>

            {!isLogged? (
                <div className="flex-1 flex text-xl justify-end space-x-3">
                    <a 
                    className="hover:cursor-pointer hover:text-blue-500"
                    href="../login"
                    >
                        Login
                    </a>

                    <span> / </span>
                    <a 
                    className="hover:cursor-pointer hover:text-blue-500"
                    href="../register"
                    >
                        Register
                    </a>
                </div>
            ) : (
                <div className="flex-1 flex text-xl justify-end">
                    <span> Hello,  </span>
                    <p 
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={() => handleModal()}
                    >
                        {username}
                    </p>
                    
                    {showModal && (
                        <button 
                        className="absolute w-30 right-8 top-15 text-sm text-red-500 hover:cursor-pointer rounded-lg bg-gray-200 border border-gray-700 p-2"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>  
    );
}