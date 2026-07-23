import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header";
import TVNavigation from "../components/layout/TVNavigation";

const MainLayout=()=>{
    return(
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            <TVNavigation />
            <Header />
            <main className="ml-24 min-w-0 lg:ml-72">

            <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout;
