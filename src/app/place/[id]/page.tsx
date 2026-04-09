"use client"

import { API_URL } from "@/utils/BackEndAPI";
import { use, useEffect, useState } from "react";
import { isLoggedIn, getUserRole } from "@/utils/Auth";
import { redirect } from 'next/navigation';
import Navbar from "@/Component/Navbar";
import Link from "next/link";
import AddCourtModal from "@/Component/AddCourtModal";

interface Place{
    name: string,
    description: string,
    city: string,
    address: string,
    openHour: string,
    closeHour: string,
    ownerName: string,
    pagedCourts: PagedModel
}

interface PagedModel{
    totalData: number,
    totalPages: number,
    currentPage: number,
    datas: Court[],
}

interface Court{
    courtId: string,
    courtName: string,
    courtNumber: number,
    pricePerHour: number,
}

interface Params{
    id: string
}

export default function placeDetail({ params }: {params : Promise<Params>}){
    const resolvedParams = use(params);
    const placeId = resolvedParams.id;

    const isUserLoggedin = isLoggedIn();
    const role = getUserRole();

    const [searchCourt, setSearchCourt] = useState('');
    const [placeDetail, setPlaceDetail] = useState<Place | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const userRole = getUserRole();
    const isAdmin = userRole === "Admin";
    const isOwner = userRole === "Owner";

    const fetchData = async (stringInput: string, pageNumber: number) => {
        setIsLoading(true);
        try{
            const queryParam = new URLSearchParams({
                StringInput: stringInput,
                PageSize: "10",
                PageNumber: pageNumber.toString(),
            });
            const url = `${API_URL.PLACE.GetDetail(placeId)}?${queryParam.toString()}`;
            const response = await fetch(url,{
                method: "GET",
            })

            if(response.ok){
                const result: Place = await response.json();
                console.log("OKE", result);
                setPlaceDetail(result);
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

    useEffect(() => {
        const searchTimeOut = setTimeout(() => {
            fetchData(searchCourt, 1);
            setIsMounted(true);
        }, 1000);

        return () => clearTimeout(searchTimeOut);
    }, [searchCourt]);

    const handlePagedChange = (pageNum: number) => {
        if(pageNum === placeDetail?.pagedCourts.currentPage) return;

        fetchData(searchCourt, pageNum);
    }

    const handleAddCourtButton = () =>{
        setAddModal(true);
    }

    return(
        <div>
            <Navbar/>

            <AddCourtModal
            isOpen={addModal}
            onClose={() => setAddModal(false)}
            placeId={placeId}
            />

            <div className="p-4">
                <div className="flex items-start ml-10">
                    <Link
                    href={`/homepage`}
                    className="text-2xl"
                    >
                    {"< Back"}
                    </Link>
                </div>
                    
                <div className="flex flex-col justify-center items-center mt-10">
                    <div className="w-full grid grid-cols-3 items-center justify-between p-4">
                        <p className="text-5xl ml-5">
                            {placeDetail?.name} 
                                <span className="text-lg ml-3">
                                    {placeDetail?.description}
                                </span>
                            </p>
                        
                        <div/>
                        
                        <div className="border-2 rounded-lg p-2 left-13">
                            <span>
                                {placeDetail?.city}, 
                                {placeDetail?.address}<br/>
                            </span>
                            {placeDetail?.openHour} - {placeDetail?.closeHour}
                        </div>
                    </div>
                    

                    <div className="w-10/12 mt-10">
                        <div className="flex justify-end items-end">
                            <input
                            type="text"
                            className="border-2 rounded-lg p-3 "
                            placeholder="Search Court"
                            value={searchCourt}
                            onChange={(e) => setSearchCourt(e.target.value)}
                            />
                        </div>

                        {isMounted && isOwner && (
                            <div className="flex justify-start ml-4 mt-2">
                                <button
                                className="border-2 p-2 rounded-lg text-lg bg-black text-white hover:bg-white hover:text-black hover:cursor-pointer"
                                onClick={handleAddCourtButton}
                                >
                                + Add Court
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <div className="w-250 grid grid-cols-4 p-4 gap-5 right-4">
                                {placeDetail?.pagedCourts.datas.length == 0 ? (
                                    <div className="flex col-span-4 justify-center">
                                        No Courts Found
                                    </div>
                                ) : (
                                    placeDetail?.pagedCourts.datas.map((court) => (
                                        <Link
                                        key={court.courtId}
                                        href={`../court/${court.courtId}`}
                                        className="border-2 rounded-lg p-2"
                                        >
                                        {court.courtName} <br/>
                                        {court.courtNumber} <br/>
                                        {court.pricePerHour} <br/>
                                        </Link>
                                    ))
                                )}
                            </div>

                            <div className="flex justify-center items-center align-middle space-x-3 mt-10">
                                <button
                                onClick={() => handlePagedChange(placeDetail?.pagedCourts.currentPage ?? 0 - 1)}
                                disabled={placeDetail?.pagedCourts.currentPage === 1}
                                >
                                    {"<"}
                                </button>

                                {Array.from({length: placeDetail?.pagedCourts.totalPages ?? 0}, (_,index) => {
                                    const pageNum = index + 1;
                                    return(
                                        <button
                                        key={pageNum}
                                        className={`${pageNum === placeDetail?.pagedCourts.currentPage ? "text-black" : "text-gray-600"}`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                <button
                                onClick={() => handlePagedChange(placeDetail?.pagedCourts.currentPage ?? 0 + 1)}
                                disabled={placeDetail?.pagedCourts.currentPage == placeDetail?.pagedCourts.totalPages}
                                >
                                    {">"}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>
    );
}