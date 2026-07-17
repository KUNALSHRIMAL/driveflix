import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header";

const MainLayout=()=>{
    return(
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            <Header />
            <main>

            <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout;