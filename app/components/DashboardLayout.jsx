"use client"
import React, { useContext } from 'react'
import { UserContext } from '@/src/context/UserContext'
import Navbar from './Navbar'

const DashboardLayout = ({ activeMenu, children }) => {

    const context = useContext(UserContext)

//     if (!context) {
//         return <div className="min-h-screen bg-zinc-950" />; 
//     }

//     // 3. Now it is safe to destructure
//     const { user } = context;

//   return (
//     <div>
//         {/* <Navbar activeMenu={activeMenu}/>
//         {user && <div className='container mx-auto pt-4 pb-4'>{children}</div>} */}
//         <Navbar activeMenu={activeMenu}/>
//             {/* 4. Only show children if user exists (to protect private routes) */}
//             <div className='container mx-auto pt-4 pb-4'>
//                 {user ? children : <p className="text-white text-center mt-10">Loading User Profile...</p>}
//             </div>

//     </div>
//   )
// }

return (
        <div className="min-h-screen bg-white text-black"> 
            <Navbar activeMenu={activeMenu}/>
            <div className='container mx-auto pt-4 pb-4'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout