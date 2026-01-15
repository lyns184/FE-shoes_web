import { useQuery } from '@tanstack/react-query';
import { getAllColors, type Color } from '../../../services/product';

interface Variant {
    color: { label: string; hex: string; id?: number };
    size: number;
    quantity: number;
}

interface VariantsFormProps {
    uploadedImages: string[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    selectedColors: string[];
    onToggleColor: (colorName: string) => void;
    availableSizes: string[];
    selectedSizes: string[];
    onToggleSize: (size: string) => void;
    variants: Variant[];
    onQuantityChange: (colorLabel: string, size: number, quantity: number) => void;
}

const VariantsForm = ({
    uploadedImages,
    onUpload,
    onRemoveImage,
    selectedColors,
    onToggleColor,
    availableSizes,
    selectedSizes,
    onToggleSize,
    variants,
    onQuantityChange,
}: VariantsFormProps) => {
    // Fetch colors from API
    const { data: colorsData, isLoading: colorsLoading } = useQuery({
        queryKey: ['colors'],
        queryFn: getAllColors,
    });

    const availableColors = colorsData?.data || [];
    return (
        <div className="space-y-8">
            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Product Images</label>
                <label className="w-full border-2 border-dashed border-neutral-300 rounded-lg p-10 text-center cursor-pointer hover:border-neutral-400 transition-colors flex flex-col items-center justify-center gap-2">
                    <input
                        key={uploadedImages.length}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onUpload}
                        className="hidden"
                    />
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1 text-neutral-600">
                        <path d="M24 8V40M8 24H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-neutral-900 font-medium">Click to upload or drag and drop</p>
                    <p className="text-neutral-500 text-sm">PNG, JPG, GIF</p>
                </label>

                {uploadedImages.length > 0 && (
                    <div className="mt-4 w-full">
                        <p className="text-neutral-700 font-medium text-sm mb-3">Images Preview ({uploadedImages.length}/8)</p>
                        <div className="flex flex-wrap gap-2 w-full">
                            {uploadedImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-48 h-48 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0"
                                >
                                    <img src={image} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => onRemoveImage(index)}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-neutral-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors"
                                        aria-label="Remove image"
                                    >
                                        <span className="text-white font-bold text-xs">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Available Colors</label>
                {colorsLoading ? (
                    <div className="text-neutral-500 text-sm">Loading colors...</div>
                ) : availableColors.length === 0 ? (
                    <div className="text-neutral-500 text-sm">No colors available</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {availableColors.map((color) => (
                                <label key={color.id} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedColors.includes(color.name)}
                                        onChange={() => onToggleColor(color.name)}
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-5 h-5 rounded border border-neutral-300"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="text-neutral-900 font-medium">{color.name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {selectedColors.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedColors.map((colorName) => {
                                    const color = availableColors.find(c => c.name === colorName);
                                    const isWhite = color?.hex === '#FFFFFF';
                                    return (
                                        <div
                                            key={colorName}
                                            className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${
                                                isWhite
                                                    ? 'border border-neutral-300 text-neutral-900 bg-white'
                                                    : 'text-white'
                                            }`}
                                            style={!isWhite ? { backgroundColor: color?.hex } : {}}
                                        >
                                            {colorName}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Available Sizes</label>
                <div className="grid grid-cols-5 gap-3 mb-4">
                    {availableSizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => onToggleSize(size)}
                            className={`py-3 px-4 rounded-lg font-semibold text-base transition-all cursor-pointer ${
                                selectedSizes.includes(size)
                                    ? 'bg-[#396254] text-white'
                                    : 'bg-white border border-neutral-300 text-neutral-900 hover:border-neutral-400'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                {selectedSizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {[...selectedSizes].sort((a, b) => parseInt(a) - parseInt(b)).map((size) => (
                            <div
                                key={size}
                                className="px-3 py-2 rounded-full border border-neutral-300 text-neutral-900 font-medium text-sm"
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedColors.length > 0 && selectedSizes.length > 0 && (
                <div>
                    <label className="block text-base font-medium text-neutral-900 mb-3">Product Variants</label>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-neutral-700 text-base font-semibold border-b border-neutral-200">
                                    <th className="py-3 px-4">Color</th>
                                    <th className="py-3 px-4">Size</th>
                                    <th className="py-3 px-4 text-right">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="text-neutral-900 text-base">
                                {variants.map((variant, index) => (
                                    <tr key={index} className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-5 h-5 rounded-sm border border-neutral-300"
                                                    style={{ backgroundColor: variant.color.hex }}
                                                />
                                                <span className="font-medium">{variant.color.label}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-medium">{variant.size}</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={variant.quantity}
                                                    onChange={(e) =>
                                                        onQuantityChange(variant.color.label, variant.size, parseInt(e.target.value) || 0)
                                                    }
                                                    className="w-24 px-3 py-2 border border-neutral-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantsForm;