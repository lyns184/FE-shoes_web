import AdminSidebar from "../../components/common/AdminSidebar";
import { Outlet } from 'react-router-dom';

const Admin = () => {

    return <div className="w-full flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col bg-[#F4F3F1]">
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    </div> 
}

export default Admin;