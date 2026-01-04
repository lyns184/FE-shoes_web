import AdminSidebar from "../../components/common/AdminSidebar";
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Admin = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return <div className="w-full h-screen overflow-hidden flex">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-20' : 'ml-87'}`} />
        <div className="flex-1 flex flex-col bg-[#F4F3F1] h-screen overflow-hidden">
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    </div> 
}

export default Admin;