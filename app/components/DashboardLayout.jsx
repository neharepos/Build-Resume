"use client"
import React from 'react'
import Navbar from './Navbar'

const DashboardLayout = ({ activeMenu, children }) => {

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
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30"> 
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                <Navbar activeMenu={activeMenu}/>
                <main className='container mx-auto pt-8 pb-12 px-4 md:px-6'>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout