"use client";
import { useState } from "react";
import { API_URL } from "../../utils/BackEndAPI"

interface RegisterProps{
    username: string,
    email: string,
    password: string,
}

export default function Register(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const clearInputs = () =>{
        setUsername('');
        setEmail('');
        setPassword('');
    }

    const handleSubmit = async () => {
        setErrorMessages('');
        setIsLoading(true);

        const payload = {
            username: username,
            email: email,
            password: password
        };

        try{
            const response = await fetch(API_URL.AUTH.Register, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(payload)
            })

            if(response.ok){
                const data = await response.json();
                console.log("Success",data);
            }
            else{
                const errorData = await response.json();
                setErrorMessages(errorData.message || "Gagal mengirim data ke server.");
            }
        }
        catch (error){
            console.error("Network Error:", error);
        }

        setIsLoading(false);
        clearInputs();
    }
    
    return(
        <div className="flex justify-center items-center min-h-screen">
            <div className="border-3 border-black rounded-xl w-150 p-10">

                <div className="flex justify-center mb-4">
                    <p className="text-3xl">Register</p>
                </div>
                
                <div className="space-y-7">
                    <div className="flex flex-col">
                        <label className="mb-2">Username: </label>
                        <input
                        className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                        placeholder="Insert Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2">Email: </label>
                        <input
                        className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                        placeholder="Insert Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2">Password: </label>
                        <input
                        className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                        placeholder="Insert Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <a 
                    className="text-sm text-blue-400 hover:cursor-pointer hover:text-blue-300"
                    href="/Login"
                    >
                        already have an account? Login, Here!
                    </a>

                    <button 
                    className="border-2 border-black rounded-xl p-3 hover:bg-black hover:border-white hover:text-white hover:cursor-pointer"
                    onClick={() => handleSubmit()}
                    >
                        Submit
                    </button>
                </div>

            </div>
        </div>
    );
}