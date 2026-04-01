"use client"

import Navbar from "@/Component/Navbar";
import { getToken, getUserRole } from "@/utils/Auth"
import { API_URL } from "@/utils/BackEndAPI";
import { useEffect, useState } from "react";

interface User{
    userId: string,
    userName: string,
    email: string,
    role: string,
}

interface PagedModel{
    totalData: number,
    totalPages: number,
    currentPage: number,
    data: User[],
}

export default function AdminHomepage(){
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin";

    const [isLoading, setIsLoading] = useState(false);
    const [pagedModel, setPagedModel] = useState<PagedModel>({
        totalData: 0,
        totalPages: 1,
        currentPage: 1,
        data: []
    });
    const [searchInput, setSearchInput] = useState('');

    const fetchDataUser = async (stringInput: string, pageNumber: number) => {
        setIsLoading(true);
        const token = getToken();
        
        try{
            const queryParam = new URLSearchParams({
                stringInput: stringInput,
                pageSize: "10",
                pageNumber: pageNumber.toString(),
            });
            const url = `${API_URL.USER.GetAll}?${queryParam}`;
            const response = await fetch(url, {
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });

            if(response.ok){
                const result: PagedModel = await response.json();
                console.log(result);
                setPagedModel(result);
            }
            else{
                console.log("OH NO");
            }
        }
        catch (error){
            console.error("Network Error:", error);
        }

        setIsLoading(false);
    }

    useEffect(() => {
         const searchTimeOut = setTimeout(() => {
            fetchDataUser(searchInput, 1);
        }, 1000);

        return () => clearTimeout(searchTimeOut);
    }, [searchInput]);

    const handlePageChange = (newPage: number) => {
        if(newPage === pagedModel.currentPage) return;

        fetchDataUser(searchInput, newPage);
    }

    return(
        <div>

            <Navbar/>

            <div className="flex justify-center items-center mt-6">
                <input
                className="border-2 rounded-lg mt-5 p-3"
                placeholder="Search Username"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            <div className="p-3 mt-10">
                <table className="min-w-full w-full table-auto border-collapse border-2 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border-2 px-2 py-1">User Id</th>
                            <th className="border-2 px-2 py-1">Username</th>
                            <th className="border-2 px-2 py-1">Email</th>
                            <th className="border-2 px-2 py-1">Role</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {pagedModel.data.map((index) => {
                            return(
                                <tr
                                key={index.userId}
                                className="hover:bg-gray-200"
                                >
                                    <td className="border-2 px-2 py-1">{index.userId}</td>
                                    <td className="border-2 px-2 py-1">{index.userName}</td>
                                    <td className="border-2 px-2 py-1">{index.email}</td>
                                    <td className="border-2 px-2 py-1">{index.role}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center align-middle space-x-3 mt-10">
                <button
                onClick={() => handlePageChange(pagedModel.currentPage - 1)}
                disabled={pagedModel.currentPage === 1}
                >
                    {"<"}
                </button>

                {Array.from({length: pagedModel.totalPages}, (_, index) => {
                    const pageNum = index + 1;
                    return(
                        <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`${pageNum === pagedModel.currentPage? "text-black" : "text-gray-600"}`}
                        >
                            {pageNum}
                        </button>
                    )
                })}

                <button
                onClick={() => handlePageChange(pagedModel.currentPage + 1)}
                disabled={pagedModel.currentPage === pagedModel.totalPages}
                >
                    {">"}
                </button>
            </div>
        </div>
    )
}