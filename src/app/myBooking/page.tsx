"use client"

import Navbar from "@/Component/Navbar";
import { getToken, getUserRole, isLoggedIn } from "@/utils/Auth"
import { API_URL } from "@/utils/BackEndAPI";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface BaseBooking{
    bookingId: string,
    placeName: string,
    courtName: string,
    courtNumber: number,
    date: Date,
    startTime: string,
    endTime: string,
    status: string,
}

interface OwnerBooking extends BaseBooking {
    username: string;
}

interface AdminBooking extends BaseBooking{
    courtId: string,
    placeId: string, 
    userId: string,
    username: string,
}

export type MyBookingType = BaseBooking | AdminBooking | OwnerBooking;

interface PagedModel{
    totalData: number,
    totalPage: number,
    currentPage: number,
    datas: MyBookingType[],
}

export default function MyBooking(){
    const isLogged = isLoggedIn();
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin";
    const isOwner = userRole === "Owner";
    const isCustomer = userRole === "Customer";

    const [isLoading, setIsLoading] = useState(false);
    const [pagedData, setPagedData] = useState<PagedModel>({
        totalData: 0,
        totalPage: 1,
        currentPage: 1,
        datas: []
    });
    const [isMounted, setIsMounted] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const fetchCustomerBookingData = async (stringInput: string, pageNumber: number) => {
        setIsLoading(true);
        try{
            const currentToken = getToken();
            if (!currentToken) {
            console.log("Token tidak ditemukan, batalkan request.");
            return; 
            }
            
            const queryParam = new URLSearchParams({
                StringInput: stringInput,
                PageSize: "10",
                PageNumber: pageNumber.toString(),
            });
            const url = `${API_URL.BOOKING.GetCustomerBooking}?${queryParam.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers:{
                    'Authorization': `Bearer ${currentToken}`
                }
            }) 

            if(response.ok){
                const result = await response.json();
                setPagedData(result);
                console.log(result);
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

    const fetchAdminBookings = async (stringInput: string, pageNumber: number) => {
        setIsLoading(true);
        try{
            const currentToken = getToken();
            if (!currentToken) {
            console.log("Token tidak ditemukan, batalkan request.");
            return; 
            }
            
            const queryParam = new URLSearchParams({
                StringInput: stringInput,
                PageSize: "10",
                PageNumber: pageNumber.toString(),
            });
            const url = `${API_URL.BOOKING.GetAdminBooking}?${queryParam.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers:{
                    'Authorization': `Bearer ${currentToken}`
                }
            }) 

            if(response.ok){
                const result = await response.json();
                setPagedData(result);
                console.log(result);
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

    const fetchOwnerBookings = async (stringInput: string, pageNumber: number) => {
        setIsLoading(true);
        try{
            const currentToken = getToken();
            if (!currentToken) {
            console.log("Token tidak ditemukan, batalkan request.");
            return; 
            }
            
            const queryParam = new URLSearchParams({
                StringInput: stringInput,
                PageSize: "10",
                PageNumber: pageNumber.toString(),
            });
            const url = `${API_URL.BOOKING.GetOwnerBooking}?${queryParam.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers:{
                    'Authorization': `Bearer ${currentToken}`
                }
            }) 

            if(response.ok){
                const result = await response.json();
                setPagedData(result);
                console.log(result);
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
        setIsMounted(true);

        const searchTimeOut = setTimeout(() => {
            if(isAdmin){
                fetchAdminBookings(searchInput, 1);
            }
            else if (isOwner){
                fetchOwnerBookings(searchInput, 1);
            }
            else if(isCustomer){
                fetchCustomerBookingData(searchInput, 1);
            }
        }, 500);

        return () => clearTimeout(searchTimeOut);
    }, [searchInput])

    if(!isMounted){
        return null;
    }

    return (
        <div>
            <Navbar/>

            <div className="flex justify-center mt-20">
                <div className=" flex flex-col items-center">
                    <h1 className="text-4xl">
                        My Booking
                    </h1>

                    <input
                    className="border-2 rounded-lg mt-5 p-3"
                    placeholder="Search Place / Court"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    />

                </div>
            </div>

            <div className="mt-10 p-3">
                <table className="min-w-full w-full table-auto border-collapse border-2">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border-2 px-4 py-3">Booking Id</th>
                            {isAdmin && (
                                    <th className="border-2 px-4 py-3">User Id</th>
                            )}
                            {(isAdmin || isOwner) && (
                                    <th className="border-2 px-4 py-3">Username</th>
                            )}
                            {isAdmin && (
                                <>      
                                    <th className="border-2-300 px-4 py-3">Place Id</th>
                                </>
                            )}
                            <th className="border-2 px-4 py-3">Place Name</th>
                            {isAdmin && (
                                    <th className="border-2 px-4 py-3">Court Id</th>
                            )}
                            <th className="border-2 px-4 py-3">Court Name</th>
                            <th className="border-2 px-4 py-3">Court Number</th>
                            <th className="border-2 px-4 py-3">Date</th>
                            <th className="border-2 px-4 py-3">Start Time</th>
                            <th className="border-2 px-4 py-3">End Time</th>
                            <th className="border-2 px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    {isLogged? (
                        <tbody className="border-t-2">
                            {pagedData.datas.map((booking) => {
                                const hasUsername = 'username' in booking;
                                const isAdmintData = 'userId' in booking;

                                return(
                                    <tr 
                                    key={booking.bookingId}
                                    className="hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <td className="border-2 py-1 text-sm px-2">{booking.bookingId}</td>
                                        {isAdmin && (
                                            <td className="border-2 py-1 text-sm px-2">{isAdmintData? booking.userId : "-"}</td> 
                                        )}
                                        {(isAdmin || isOwner) && (
                                                <td className="border-2 py-1 text-sm px-2">{hasUsername? booking.username : "-"}</td>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <td className="border-2 py-1 text-sm px-2">{isAdmintData? booking.placeId : "-"}</td>
                                            </>
                                        )}
                                        <td className="border-2 py-1 text-sm px-2">{booking.placeName}</td>
                                        {isAdmin && (
                                            <td className="border-2 py-1 text-sm px-2">{isAdmintData? booking.courtId : "-"}</td>
                                        )}
                                        <td className="border-2 py-1 text-sm px-2">{booking.courtName}</td>
                                        <td className="border-2 py-1 text-sm px-2">{booking.courtNumber}</td>
                                        <td className="border-2 py-1 text-sm px-2">{booking.date.toString()}</td>
                                        <td className="border-2 py-1 text-sm px-2">{booking.startTime}</td>
                                        <td className="border-2 py-1 text-sm px-2">{booking.endTime}</td>
                                        <td className="border-2 py-1 text-sm px-2">{booking.status}</td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    ): (
                        <>
                        </>
                    )}
                </table>
                {!isLogged && (
                    <div className="absolute text-2xl right-150 top-100">
                        Log In to access this page
                    </div>
                )}
            </div>
        </div>
    )
}