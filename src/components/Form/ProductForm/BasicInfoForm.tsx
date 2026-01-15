import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ProductFormData } from './index';
import { getAllBrands, type Brand } from '../../../services/product';

const CATEGORY_OPTIONS = ['Trending', 'Best Seller', 'Freeship', 'New', 'Popular'] as const;

interface BasicInfoFormProps {
    formData: ProductFormData;
    onChange: (field: keyof Omit<ProductFormData, 'images' | 'variants'>, value: any) => void;
}

const BasicInfoForm = ({ formData, onChange }: BasicInfoFormProps) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement | null>(null);

    // Fetch brands from API
    const { data: brandsData, isLoading: brandsLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: getAllBrands,
    });

    const availableBrands = brandsData?.data || [];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!isCategoryOpen) return;
            const target = e.target as HTMLElement;
            // Don't close dropdown if clicking within category dropdown
            if (categoryRef.current && categoryRef.current.contains(e.target as Node)) {
                return;
            }
            // Close dropdown if clicking outside
            setIsCategoryOpen(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [isCategoryOpen]);

    const toggleCategory = (cat: string) => {
        const active = formData.categories.includes(cat);
        const next = active ? formData.categories.filter(c => c !== cat) : [...formData.categories, cat];
        onChange('categories', next);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Product name</label>
                    <input
                        type="text"
                        placeholder="Enter Product Name"
                        value={formData.productName}
                        onChange={(e) => onChange('productName', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Brand</label>
                    {brandsLoading ? (
                        <select disabled className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-not-allowed bg-neutral-50">
                            <option>Loading brands...</option>
                        </select>
                    ) : (
                        <select
                            value={formData.brand}
                            onChange={(e) => onChange('brand', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-pointer bg-white"
                        >
                            <option value="">Select Brand</option>
                            {availableBrands.map(brand => (
                                <option key={brand.id} value={brand.id.toString()}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Price</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => onChange('price', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Discount (%)</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={formData.discount}
                        onChange={(e) => onChange('discount', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div ref={categoryRef} className="relative">
                    <label className="block text-base font-medium text-neutral-900 mb-3">Categories</label>
                    <button
                        type="button"
                        onClick={() => setIsCategoryOpen(v => !v)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                        <span className={`truncate ${formData.categories.length === 0 ? 'text-neutral-400' : 'text-neutral-900'}`}>
                            {formData.categories.length === 0 ? 'Select categories' : formData.categories.join(', ')}
                        </span>
                        <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.02344 1.02344L6.1414 6.1414L11.2594 1.02344" stroke="#1E1E1E" strokeWidth="2.04719" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {isCategoryOpen && (
                        <div className="absolute z-20 mt-2 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-auto"
                             onClick={(e) => e.stopPropagation()}>
                            {CATEGORY_OPTIONS.map(cat => (
                                <label key={cat} className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.categories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                                    />
                                    <span className="text-neutral-900">{cat}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => onChange('status', e.target.value as 'Active' | 'Inactive')}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-pointer bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Product description</label>
                <textarea
                    placeholder="Enter your description"
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default BasicInfoForm;