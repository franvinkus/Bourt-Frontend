"use client"

export default function Navbar(){
    return(
      <div className="bg-white hover:bg-gray-200">
        <div className="flex flex-row justify-center items-center align-middle p-3 h-20">
            <div className="flex-1 flex pl-10">
                <p className="text-3xl">Bourt</p>
            </div>

            <div className="flex-none text-xl space-x-15 -ml-20">
                <a className="hover:cursor-pointer">Home</a>

                <a className="hover:cursor-pointer">Places</a>
                
                <a className="hover:cursor-pointer">My Bookings</a>
            </div>

            <div className="flex-1 flex text-xl justify-end space-x-3">
                <a 
                className="hover:cursor-pointer hover:text-blue-500"
                href="../Login"
                >
                    Login
                </a>

                <span> / </span>
                <a 
                className="hover:cursor-pointer hover:text-blue-500"
                href="../Register"
                >
                    Register
                </a>
            </div>
        </div>
      </div>  
    );
}