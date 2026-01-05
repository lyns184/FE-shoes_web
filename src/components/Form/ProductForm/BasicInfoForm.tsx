import { type ProductFormData } from './index';

interface BasicInfoFormProps {
    formData: ProductFormData;
    onChange: (field: keyof Omit<ProductFormData, 'images' | 'selectedColors' | 'selectedSizes'>, value: string | number) => void;
}

const BasicInfoForm = ({ formData, onChange }: BasicInfoFormProps) => {
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
                    <select
                        value={formData.brand}
                        onChange={(e) => onChange('brand', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-pointer bg-white"
                    >
                        <option value="">Brand Name</option>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Puma">Puma</option>
                    </select>
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
                    <label className="block text-base font-medium text-neutral-900 mb-3">Stock</label>
                    <input
                        type="number"
                        placeholder="1"
                        value={formData.stock}
                        onChange={(e) => onChange('stock', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Category</label>
                <select
                    value={formData.category}
                    onChange={(e) => onChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-pointer bg-white"
                >
                    <option value="">Category Name</option>
                    <option value="Trending">Trending</option>
                    <option value="Sale">Sale</option>
                    <option value="Popular">Popular</option>
                    <option value="New">New</option>
                </select>
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