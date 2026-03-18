"use client"

import { useEffect, useState } from "react";
import Narbar from "../../Component/Navbar"
import { API_URL } from "@/utils/BackEndAPI";
import Link from "next/link";


interface Place{
    placeId: string,
    name: string,
    description: string,
    city: string,
    address: string,
    openHour: string,
    closeHour: string,
    ownerName: string,
}

interface PagedModel{
    totalData: number,
    totalPage: number,
    currentPage: number,
    datas: Place[],
}

export default function Homepage(){
    const [searchPlace, setSearchPlace] = useState('');
    const [pagedData, setPagedData] = useState<PagedModel>({
        totalData: 0,
        totalPage: 1,
        currentPage: 1,
        datas: []
    });
    const [isLoading, setIsLoading] = useState(false);

    
    const fetchData = async (stringInput: string = '', pageNumber: number = 1) => {
        setIsLoading(true);

        try{
            const queryParam = new URLSearchParams({
                StringInput: stringInput,
                PageSize: "10",
                PageNumber: pageNumber.toString(),
            });

            const url = `${API_URL.PLACE.GetAll}?${queryParam.toString()}`;
            const response = await fetch(url, {
                method:"GET",
            });

            if(response.ok){
                const result: PagedModel = await response.json();
                console.log("OKE", result);
                setPagedData(result);
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
            fetchData(searchPlace, 1);
        }, 1000);

        return () => clearTimeout(searchTimeOut);
    }, [searchPlace]);

    const handlePagedChange = (newPage: number) => {
        if(newPage === pagedData.currentPage) return;
        
        fetchData(searchPlace, newPage);
    }

    return(
        <div>
            <Narbar/>

            <div className="h-screen overflow-auto">
                <div className="flex justify-center items-center mt-10">
                    <input
                    type="text"
                    className="border-2 rounded-lg p-3 "
                    placeholder="Search Place"
                    value={searchPlace}
                    onChange={(e) => setSearchPlace(e.target.value)}
                    />
                </div>
                
                <div className="mt-10 p-5">
                    {isLoading? (
                        <div className="text-center">Loading...</div>
                    ) : 
                    (
                        <div>
                            <div className="grid grid-cols-4 gap-8">
                                {pagedData.datas.map((place) => (
                                    <Link
                                    key={place.placeId}
                                    className="border-2 rounded-lg p-4"
                                    href={`place/${place.placeId}`}
                                    >
                                        <p className="text-2xl">{place.name}</p>
                                        <p className="text-md">{place.ownerName}</p>

                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>

                                        <p>{place.city}</p>
                                        <p>{place.address}</p>
                                        <p>{place.openHour} - {place.closeHour}</p>
                                    </Link>
                                ))}
                            </div>
                            
                            
                            <div className="flex justify-center items-center align-middle space-x-3 mt-10">
                                <button
                                onClick={() => handlePagedChange(pagedData.currentPage - 1)}
                                disabled={pagedData.currentPage === 1}
                                >
                                    {"<"}
                                </button>

                                {Array.from({length: pagedData.totalPage}, (_, index) => {
                                    const pageNum = index + 1;
                                    return(
                                        <button
                                        key={pageNum}
                                        onClick={() => handlePagedChange(pageNum)}
                                        className={`${pageNum === pagedData.currentPage? "text-black" : "text-gray-600"}`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                <button
                                onClick={() => handlePagedChange(pagedData.currentPage + 1)}
                                disabled={pagedData.currentPage === pagedData.totalPage}
                                >
                                    {">"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>      
    );
}