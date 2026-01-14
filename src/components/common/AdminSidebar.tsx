import { useState } from 'react';
import logoImg from '../../assets/logo2.png';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (value: boolean) => void }) => {
    const navigate = useNavigate();
    const navItems = [ {
        label: 'Dashboard',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#396254] group-hover:text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M25.3333 4H6.66667C5.19391 4 4 5.19391 4 6.66667V25.3333C4 26.8061 5.19391 28 6.66667 28H25.3333C26.8061 28 28 26.8061 28 25.3333V6.66667C28 5.19391 26.8061 4 25.3333 4Z" />
                <path d="M13.3333 9.33333H9.33333V21.3333H13.3333V9.33333Z" />
                <path d="M22.6667 9.33333H18.6667V16H22.6667V9.33333Z" />
            </svg>
        )
        },
        {
            label: 'Products',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#396254] group-hover:text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12.5334L10 5.61337M4.36 9.28003L16 16.0134L27.64 9.28003M16 29.44V16M28 21.3334V10.6667C27.9995 10.1991 27.8761 9.73978 27.6421 9.33492C27.408 8.93005 27.0717 8.59385 26.6667 8.36003L17.3333 3.0267C16.9279 2.79265 16.4681 2.66943 16 2.66943C15.5319 2.66943 15.0721 2.79265 14.6667 3.0267L5.33333 8.36003C4.92835 8.59385 4.59197 8.93005 4.35795 9.33492C4.12392 9.73978 4.00048 10.1991 4 10.6667V21.3334C4.00048 21.801 4.12392 22.2603 4.35795 22.6651C4.59197 23.07 4.92835 23.4062 5.33333 23.64L14.6667 28.9734C15.0721 29.2074 15.5319 29.3306 16 29.3306C16.4681 29.3306 16.9279 29.2074 17.3333 28.9734L26.6667 23.64C27.0717 23.4062 27.408 23.07 27.6421 22.6651C27.8761 22.2603 27.9995 21.801 28 21.3334Z" />
                </svg>
            )
        },
        {
            label: 'Orders',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#396254] group-hover:text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <g clipPath="url(#clip0_153_1001)">
                        <path d="M1.33301 1.33337H6.66634L10.2397 19.1867C10.3616 19.8006 10.6956 20.352 11.1831 20.7444C11.6706 21.1369 12.2806 21.3454 12.9063 21.3334H25.8663C26.4921 21.3454 27.1021 21.1369 27.5896 20.7444C28.0771 20.352 28.4111 19.8006 28.533 19.1867L30.6663 8.00004H7.99967M13.333 28C13.333 28.7364 12.7361 29.3334 11.9997 29.3334C11.2633 29.3334 10.6663 28.7364 10.6663 28C10.6663 27.2637 11.2633 26.6667 11.9997 26.6667C12.7361 26.6667 13.333 27.2637 13.333 28ZM27.9997 28C27.9997 28.7364 27.4027 29.3334 26.6663 29.3334C25.93 29.3334 25.333 28.7364 25.333 28C25.333 27.2637 25.93 26.6667 26.6663 26.6667C27.4027 26.6667 27.9997 27.2637 27.9997 28Z" />
                    </g>
                    <defs>
                        <clipPath id="clip0_153_1001">
                            <rect width="32" height="32" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )
        },
        {
            label: 'Users',
            icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#396254] group-hover:text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M26.6663 28V25.3333C26.6663 23.9188 26.1044 22.5623 25.1042 21.5621C24.1041 20.5619 22.7475 20 21.333 20H10.6663C9.25185 20 7.8953 20.5619 6.8951 21.5621C5.89491 22.5623 5.33301 23.9188 5.33301 25.3333V28M21.333 9.33333C21.333 12.2789 18.9452 14.6667 15.9997 14.6667C13.0542 14.6667 10.6663 12.2789 10.6663 9.33333C10.6663 6.38781 13.0542 4 15.9997 4C18.9452 4 21.333 6.38781 21.333 9.33333Z" />
                </svg>
            )
        }
    ];

    return <aside className={`fixed left-0 top-0 flex flex-col ${collapsed ? 'w-20' : 'w-87'} h-screen bg-[#396254] transition-all duration-200 z-50`}>
        <figure className="w-full flex items-center justify-end cursor-default h-27 border-b-2 border-[#D0CFCF] px-3">
            {!collapsed && <img onClick={() => navigate('/')} src={logoImg} alt="Logo" className="h-full object-contain cursor-pointer" />}
            <button aria-label="Toggle sidebar" onClick={(e) => { e.stopPropagation(); setCollapsed(prev => !prev); }} className="w-8 h-8 cursor-pointer flex items-center justify-center">
                <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 origin-center ${collapsed ? 'rotate-180' : 'rotate-0'}`}>
                    <path d="M4.66667 10L12.3333 17.6667L10 20L0 10L10 4.76837e-07L12.3333 2.33333L4.66667 10Z" fill="#F4F3F1"/>
                </svg>
            </button>
        </figure>

        <nav className='flex-1 w-full flex flex-col items-center gap-4 mt-6 overflow-visible'>
            {navItems.map((item) => {
                const path = item.label === 'Dashboard' ? '/admin' : `/admin/${item.label.toLowerCase()}`;
                return (
                    <div key={item.label} className={`relative group transition-all duration-200 ${collapsed ? 'w-16' : 'w-11/12'}`}>
                        <button type="button" onClick={() => navigate(path)} className={`cursor-pointer flex items-center gap-4 px-4 py-3 rounded-lg text-white bg-[#396254] hover:bg-white hover:text-[#396254] transition-colors duration-150 overflow-hidden w-full`}>
                            <span className={`rounded-md flex items-center justify-center bg-white group-hover:bg-[#396254] shrink-0 transition-all duration-150 ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium whitespace-nowrap text-[28px] leading-none">{item.label}</span>
                        </button>
                        {collapsed && (
                            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 whitespace-nowrap px-3 py-2 rounded bg-[#396254] text-white text-[28px] leading-none font-medium shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50">
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>

        <div className="w-full pb-6 px-3 flex justify-center">
            <button
                type="button"
                onClick={() => {
                    console.log('🚪 Admin logging out...');
                    // Import and call logout at runtime
                    import('../../services/auth').then(({ logout }) => {
                        logout();
                        window.location.href = '/';
                    });
                }}
                className={`group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-[#2f4f45] hover:bg-white hover:text-[#2f4f45] transition-colors duration-150 ${collapsed ? 'w-16 justify-center' : 'w-11/12 justify-start'}`}
            >
                <span className={`flex items-center justify-center shrink-0 transition-all duration-150 ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white group-hover:text-[#2f4f45]">
                        <path d="M9 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 16L21 12L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                {!collapsed && <span className="font-medium whitespace-nowrap text-[28px] leading-none">Logout</span>}
            </button>
        </div>
    </aside>;
}

export default AdminSidebar;