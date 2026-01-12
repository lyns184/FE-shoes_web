
const AdminHeader = ({ title = "Dashboard", subtitle = "Welcome to admin panel" }) => {
    return (
        <header className="sticky top-0 z-40 w-full h-20 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-8">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-black">{title}</h1>
                <p className="text-sm text-[#666666]">{subtitle}</p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center cursor-pointer hover:bg-[#E5E5E5] transition-colors duration-150">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#666666]">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </header>
    );
}
export default AdminHeader;