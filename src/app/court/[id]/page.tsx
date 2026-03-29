"use client"

import Navbar from "@/Component/Navbar";
import { getToken, getUserId, getUserRole, isLoggedIn } from "@/utils/Auth";
import { API_URL } from "@/utils/BackEndAPI";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface CourtDetail{
    placeId: string,
    courtName: string,
    courtNumber: number,
    pricePerHour: number,
}

interface AvailableHours{
    time: string,
    isBooked: boolean,
}

interface BookingResponse{
    id: string,
    courtId: string,
    date: string,
    startTime: string,
    endTime: string,
    message: string,
}

interface Params{
    id: string
}

export default function CourtDetail({ params }: {params : Promise<Params>}){
    const resolvedParams = use(params);
    const courtId = resolvedParams.id;
    const today = new Date().toISOString().split('T')[0];
    const token = getToken();

    const [isLogged, setIsLogged] = useState(false);
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');

    const [courtDetailData, setCourtDetailData] = useState<CourtDetail | null>(null);
    const [availableHours, setAvailableHours] = useState<AvailableHours[] | null>(null); 
    const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
    const [startTime, setStartTime] = useState<String | null>(null);
    const [endTime, setEndTime] = useState<String | null>(null);
    const [pickedDate, setPickedDate] = useState(today);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        
        try{
            const response = await fetch(API_URL.COURT.GetDetail(courtId),{
                method: "GET",
            });

            if(response.ok){
                const result: CourtDetail = await response.json();
                console.log(result);
                setCourtDetailData(result);
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

    const fetchAvailableHours = async (pickedDate: string) => {
        setIsLoading(true)

        try{
            const queryParam = new URLSearchParams({
                date: pickedDate
            })
            const url = `${API_URL.BOOKING.GetAvailableHours(courtId)}?${queryParam.toString()}`
            const response = await fetch(url, {
                method: "GET",
            });

            if(response.ok){
                const resultHours: AvailableHours[] = await response.json();
                console.log("Available Hours:", resultHours);
                setAvailableHours(resultHours); 
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

    const handleSubmit = async () => {
        setIsLoading(true);
        if(startTime == null || endTime == null){
            alert("Pick the time of the court you want to book");
            return;
        }

        try{
            let finalEndTime = endTime;
            if(!finalEndTime){
                const finalStartTime = parseInt(startTime.toString().split(":")[0]);
                finalEndTime = `${(finalStartTime + 1).toString().padStart(2, '0')}:00`;
            }

            const payload = {
                courtId: courtId,
                userId: userId,
                date: pickedDate,
                startTime: startTime,
                endTime: endTime,
            }

            const response = await fetch(API_URL.BOOKING.InsertBooking(courtId), {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(payload) 
            });
            
            if(response.ok){
                const result: BookingResponse = await response.json();
                console.log(result.message);
                alert(`Booking berhasil ${result.message}`);
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

    const handleTimeClicked = (clickedTime: string) =>{
        if(!clickedTime){
            setStartTime(clickedTime);
        }
        else if(startTime && !endTime){
            if(clickedTime > startTime){
                const hasBookedSlotBetween = availableHours?.some(slot => {
                    const isInsideRange = slot.time >= startTime && slot.time <= clickedTime;
                    return isInsideRange && slot.isBooked;
                })

                if(hasBookedSlotBetween){
                    alert("Can't book the time if there's Booked time between the chosen time");
                    setStartTime(clickedTime);
                }
                else{
                    setEndTime(clickedTime);
                }
            }
            else if(clickedTime === startTime){
                setStartTime(null);
            }
            else{
                setStartTime(clickedTime);
            }
        }
        else{
            setStartTime(clickedTime);
            setEndTime(null);
        }
    }

    useEffect(() => {
        const searchTimeOut = setTimeout(() => {
            fetchData();
            fetchAvailableHours(pickedDate);
        }, 500);

        setIsLogged(isLoggedIn());
        setUserId(getUserId());
        setUserRole(getUserRole());

        return () => clearTimeout(searchTimeOut);
    }, [pickedDate])

    const renderBookingAction = () => {
        if(!isLogged){
            return(
                <section>
                    <h5 className="text-xl text-red-500">*You have to logged in to book a court</h5>
                </section>
            )
        }
        else if(userRole !== "Customer"){
            return(
                <div>
                    Hello
                </div>
            )
        }
        else{
            return(
                <button
                className="border-2 rounded-lg text-3xl p-2 mt-4 hover:cursor-pointer hover:bg-gray-600 hover:text-white"
                onClick={handleSubmit}
                >
                    Book Now
                </button>
            )
        }
    }

    return(
        <div>
            <Navbar/>

            <div className="p-4">
                <div className="flex items-start ml-10 mb-6">
                    <Link
                    href={`/place/${courtDetailData?.placeId}`}
                    className="text-2xl"
                    >
                    {"< Back"}
                    </Link>
                </div>
                    
                
                <div className="flex flex-row ml-10 mt-10">
                    <section className=" w-100 h-100 border-2">
                        {/* Supposedly pictures of the courts */}
                    </section>

                    <div className="flex flex-col ml-10">
                        <section className="space-y-4">
                            <h1 className="text-6xl">
                                {courtDetailData?.courtName}
                            </h1>

                            <h3 className="text-4xl">
                                Court Number: {courtDetailData?.courtNumber}
                            </h3>

                            <h5 className="text-2xl">
                                Price per Hour: {courtDetailData?.pricePerHour}
                            </h5>
                        </section>

                        <section className="mt-10">
                            <h5>
                                Pilih jadwal:
                            </h5>

                            <input
                            type="date"
                            className="border-2 p-1 rounded-lg"
                            value={pickedDate}
                            onChange={(e) => setPickedDate(e.target.value)
                            }
                            />

                            <div className="grid grid-cols-10 gap-4 mt-4">
                                {availableHours?.map((slot, index) => {
                                    const isStart = slot.time === startTime;
                                    const isEnd = slot.time === endTime;
                                    return(
                                        <button
                                        className={`border-2 rounded-lg px-3 py-0.5 ${slot.isBooked? "bg-gray-600 text-white" : isStart? "bg-blue-300 hover:cursor-pointer" : isEnd? "bg-red-300 hover:cursor-pointer" : "hover:cursor-pointer"}`}
                                        disabled={slot.isBooked}
                                        key={index}
                                        onClick={() => handleTimeClicked(slot.time)}
                                        >
                                            {slot.time}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            <div className="mt-4">
                                {renderBookingAction()}
                            </div>

                        </section>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}