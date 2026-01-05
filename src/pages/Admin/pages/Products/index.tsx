import { useMemo, useState } from 'react';
import AdminHeader from '../../../../components/common/AdminHeader';
import ProductForm, { type ProductFormData } from '../../../../components/Form/ProductForm';

type Product = {
    id: number;
    image: string;
    name: string;
    brand: string;
    category: string;
    colors: { label: string; hex: string }[];
    sizes: number[];
    price: number;
    stock: number;
    status: 'Active' | 'Inactive';
};

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<{ name: string } | null>(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const products = useMemo<Product[]>(() => ([
        {
            id: 1,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: 'Air Max 90',
            brand: 'Nike',
            category: 'Trending',
            colors: [
                { label: 'White', hex: '#FFFFFF' },
                { label: 'Red', hex: '#EF4444' }
            ],
            sizes: [38, 39, 40, 41, 42],
            price: 150,
            stock: 42,
            status: 'Active'
        },
        {
            id: 2,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: 'Ultraboost Light',
            brand: 'Adidas',
            category: 'Sale',
            colors: [
                { label: 'Black', hex: '#000000' },
                { label: 'White', hex: '#FFFFFF' }
            ],
            sizes: [39, 40, 41, 42, 43, 44],
            price: 180,
            stock: 28,
            status: 'Inactive'
        },
        {
            id: 3,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: '550',
            brand: 'New Balance',
            category: 'Popular',
            colors: [
                { label: 'White', hex: '#FFFFFF' },
                { label: 'Green', hex: '#22C55E' }
            ],
            sizes: [38, 39, 40, 41, 42, 43],
            price: 120,
            stock: 35,
            status: 'Active'
        },
        {
            id: 4,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: 'Chuck 70 High',
            brand: 'Converse',
            category: 'New',
            colors: [
                { label: 'Brown', hex: '#92400E' },
                { label: 'Black', hex: '#000000' }
            ],
            sizes: [37, 38, 39, 40, 41, 42],
            price: 85,
            stock: 64,
            status: 'Active'
        },
        {
            id: 5,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: 'Suede Classic',
            brand: 'Puma',
            category: 'Trending',
            colors: [
                { label: 'Green', hex: '#22C55E' },
                { label: 'Blue', hex: '#3B82F6' }
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44],
            price: 75,
            stock: 52,
            status: 'Active'
        },
        {
            id: 6,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex', 
            name: 'Gel-Kayano 30',
            brand: 'ASICS',
            category: 'Trending',
            colors: [
                { label: 'Black', hex: '#000000' },
                { label: 'Gray', hex: '#6B7280' }
            ],
            sizes: [39, 40, 41, 42, 43, 44],
            price: 160,
            stock: 21,
            status: 'Active'
        },
        {
            id: 7,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex',
            name: 'Suede Classic',
            brand: 'Puma',
            category: 'Trending',
            colors: [
                { label: 'Green', hex: '#22C55E' },
                { label: 'Blue', hex: '#3B82F6' }
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44],
            price: 75,
            stock: 52,
            status: 'Active'
        },
        {
            id: 8,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex', 
            name: 'Gel-Kayano 30',
            brand: 'ASICS',
            category: 'Trending',
            colors: [
                { label: 'Black', hex: '#000000' },
                { label: 'Gray', hex: '#6B7280' }
            ],
            sizes: [39, 40, 41, 42, 43, 44],
            price: 160,
            stock: 21,
            status: 'Active'
        },
    ]), []);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        return searchTerm.trim()
            ? products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : products;
    }, [searchTerm, products]);

    const totalProducts = filteredProducts.length;
    const productsPerPage = 6;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const getPaginationPages = () => {
        const pages: (number | string)[] = [];
        const maxDotsPages = 3;

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > maxDotsPages + 1) pages.push('...');
            
            for (let i = Math.max(2, currentPage - maxDotsPages); i <= Math.min(totalPages - 1, currentPage + maxDotsPages); i++) {
                if (!pages.includes(i)) pages.push(i);
            }
            
            if (currentPage < totalPages - maxDotsPages) pages.push('...');
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    return <>
        <AdminHeader title="Products" subtitle='Manage your product inventory' />
        <section className="px-9 py-11">
            {showProductForm ? (
                <div className="max-w-5xl mx-auto">
                    <ProductForm
                        mode={editingProduct ? 'edit' : 'create'}
                        productId={editingProduct?.id}
                        productName={editingProduct?.name}
                        brand={editingProduct?.brand}
                        price={editingProduct?.price}
                        stock={editingProduct?.stock}
                        category={editingProduct?.category}
                        images={editingProduct ? [editingProduct.image] : []}
                        selectedColors={editingProduct ? editingProduct.colors.map(c => c.label) : undefined}
                        selectedSizes={editingProduct ? editingProduct.sizes.map(size => size.toString()) : undefined}
                        onCancel={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                        }}
                        onSubmit={(data: ProductFormData) => {
                            console.log('Product form submitted:', data);
                            setShowProductForm(false);
                            setEditingProduct(null);
                        }}
                    />
                </div>
            ) : (
            <>
            <div className="flex flex-wrap items-center gap-6 justify-between">
                <div className="flex-1 min-w-[320px] max-w-3xl">
                    <label className="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition">
                        <svg aria-hidden="true" className="h-6 w-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="6.5" />
                            <path strokeLinecap="round" d="M16 16l4.5 4.5" />
                        </svg>
                        <input
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={`Search ${filteredProducts.length} products`}
                            className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-500 text-base"
                        />
                        {searchTerm && <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
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
                                className="h-4 w-4.25"
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
                    <button
                        type="button"
                        onClick={() => setShowProductForm(true)}
                        className="bg-[#396254] hover:bg-[#2f4f45] text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow-sm transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                    >
                        <span className="text-xl leading-none">+</span>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <div className="mt-10 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left text-neutral-500 text-lg font-semibold border-b border-neutral-200">
                                <th className="py-4 px-6">Product</th>
                                <th className="py-4 px-6">Brand</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Colors</th>
                                <th className="py-4 px-6">Sizes</th>
                                <th className="py-4 px-6">Price</th>
                                <th className="py-4 px-6">Stock</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-900 text-base">
                            {paginatedProducts.map((product) => {
                                const isActive = product.status === 'Active';
                                return (
                                    <tr key={product.id} className="border-b border-neutral-200 last:border-b-0">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <img src={product.image} alt={product.name} className="w-14 h-14 object-contain rounded-lg border border-neutral-200 bg-neutral-50" />
                                                <span className="font-semibold">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-neutral-800">{product.brand}</td>
                                        <td className="py-4 px-6">
                                            <span className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-full inline-flex text-sm font-medium">{product.category}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.colors.map((color) => (
                                                    <div key={color.label} className="flex items-center gap-2 px-2 py-1 rounded-full border border-neutral-200">
                                                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                                                        <span className="text-sm text-neutral-700">{color.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.sizes.map((size) => (
                                                    <span key={size} className="px-3 py-1 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-neutral-900">${product.price}</td>
                                        <td className="py-4 px-6 text-neutral-800">{product.stock}</td>
                                        <td className="py-4 px-6">
                                            <span className={`${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} px-4 py-2 rounded-full font-semibold text-sm inline-flex`}>{product.status}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="relative">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setOpenMenu(openMenu === product.name ? null : product.name)}
                                                    className="hover:bg-neutral-100 p-2 rounded-lg transition-colors cursor-pointer" 
                                                    aria-label="More options"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6.69989 7.25781C7.00822 7.25781 7.25818 7.00786 7.25818 6.69952C7.25818 6.39119 7.00822 6.14124 6.69989 6.14124C6.39156 6.14124 6.1416 6.39119 6.1416 6.69952C6.1416 7.00786 6.39156 7.25781 6.69989 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M10.6091 7.25781C10.9174 7.25781 11.1674 7.00786 11.1674 6.69952C11.1674 6.39119 10.9174 6.14124 10.6091 6.14124C10.3007 6.14124 10.0508 6.39119 10.0508 6.69952C10.0508 7.00786 10.3007 7.25781 10.6091 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M2.79266 7.25781C3.101 7.25781 3.35095 7.00786 3.35095 6.69952C3.35095 6.39119 3.101 6.14124 2.79266 6.14124C2.48433 6.14124 2.23438 6.39119 2.23438 6.69952C2.23438 7.00786 2.48433 7.25781 2.79266 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>

                                                {openMenu === product.name && (
                                                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-neutral-200 shadow-lg z-50 min-w-40 overflow-hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenMenu(null);
                                                                setEditingProduct(product);
                                                                setShowProductForm(true);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-800 hover:bg-neutral-50 transition-colors font-medium text-left cursor-pointer"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.5 13.5H3V4.5H4.5M8.25 3V1.5H5.25V3M13.5 7.5H12V3H13.5M2.25 15.75H15.75V14.25H2.25M3 13.5H15V4.5H3V13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                setDeleteProduct({ name: product.name });
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 4.5H4.5H15M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M7.5 8.25V13.5M10.5 8.25V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 flex justify-end items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Previous
                </button>

                <div className="flex gap-2 mx-2">
                    {getPaginationPages().map((page) => (
                        <button
                            key={page}
                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                            disabled={page === '...'}
                            className={`
                                px-3 py-2 rounded-lg font-medium transition-all
                                ${page === currentPage
                                    ? 'bg-[#396254] text-white cursor-pointer'
                                    : page === '...'
                                    ? 'text-neutral-500 cursor-not-allowed'
                                    : 'text-neutral-700 hover:bg-neutral-100 cursor-pointer'
                                }
                            `}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                >
                    Next
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            </>
            )}
        </section>

        {deleteProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 relative">
                    <button
                        type="button"
                        onClick={() => setDeleteProduct(null)}
                        className="absolute top-6 right-6 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Delete Product?</h2>
                        <p className="text-neutral-700 text-base mb-8">
                            Are you sure you want to delete product <span className="font-bold">"{deleteProduct.name}"</span>? This action can't be undone
                        </p>

                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteProduct(null)}
                                className="px-6 py-3 border-2 border-neutral-800 text-neutral-800 font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteProduct(null)}
                                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>;
};

export default AdminProducts;