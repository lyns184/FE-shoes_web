import { useMemo, useState } from 'react';
import AdminHeader from '../../../../components/common/AdminHeader';

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('All Status');

    const statuses = useMemo(() => [
        'All Status',
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ], []);

    const products = useMemo(() => ([
        {
            name: 'Air Max 90',
            brand: 'Nike',
            colors: [
                { label: 'Triple White', hex: '#ffffff' },
                { label: 'Infrared', hex: '#ef4a3c' }
            ],
            sizes: [38, 39, 40, 41, 42],
            price: 150,
            stock: 42
        },
        {
            name: 'Ultraboost Light',
            brand: 'Adidas',
            colors: [
                { label: 'Core Black', hex: '#1f1f1f' },
                { label: 'Cloud White', hex: '#f8f8f8' }
            ],
            sizes: [39, 40, 41, 42, 43, 44],
            price: 180,
            stock: 28
        },
        {
            name: '550',
            brand: 'New Balance',
            colors: [
                { label: 'White Navy', hex: '#f7f7f5' },
                { label: 'Green Gum', hex: '#0f5132' }
            ],
            sizes: [38, 39, 40, 41, 42, 43],
            price: 120,
            stock: 35
        },
        {
            name: 'Chuck 70 High',
            brand: 'Converse',
            colors: [
                { label: 'Parchment', hex: '#f3e9da' },
                { label: 'Black', hex: '#111111' }
            ],
            sizes: [37, 38, 39, 40, 41, 42],
            price: 85,
            stock: 64
        },
        {
            name: 'Suede Classic',
            brand: 'Puma',
            colors: [
                { label: 'Forest Night', hex: '#395348' },
                { label: 'Royal Blue', hex: '#235db3' }
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44],
            price: 75,
            stock: 52
        },
        {
            name: 'Gel-Kayano 30',
            brand: 'ASICS',
            colors: [
                { label: 'Midnight', hex: '#0c1626' },
                { label: 'Glacier', hex: '#dce4ed' }
            ],
            sizes: [39, 40, 41, 42, 43, 44],
            price: 160,
            stock: 21
        }
    ]), []);

    const totalProducts = products.length;

    return <>
        <AdminHeader title="Products" subtitle='Manage your product inventory' />
        <section className="px-9 py-11">
            <div className="flex flex-wrap items-center gap-6 justify-between">
                <div className="flex-1 min-w-[320px] max-w-3xl">
                    <label className="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition">
                        <svg aria-hidden="true" className="h-6 w-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="6.5" />
                            <path strokeLinecap="round" d="M16 16l4.5 4.5" />
                        </svg>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search ${totalProducts} products`}
                            className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-500 text-base"
                        />
                        {searchTerm && <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="text-neutral-500 cursor-pointer hover:text-neutral-800 transition"
                            aria-label="Clear search"
                        >
                            <svg
                                aria-hidden="true"
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-[17px]"
                            >
                                <path
                                    d="M15.0032 1.0166L1.0166 14.5829M1.0166 1.0166L15.0032 14.5829"
                                    stroke="#1A202C"
                                    strokeWidth="2.03324"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>}
                    </label>
                </div>

                <div className="flex items-center">
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="appearance-none bg-white border border-neutral-300 text-neutral-800 text-base font-semibold rounded-xl px-4 py-3 pr-10 shadow-sm cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            {statuses.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <svg aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M6 8l4 4 4-4" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    </>;
};

export default AdminProducts;