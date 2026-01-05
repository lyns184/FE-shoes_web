interface ColorOption {
    name: string;
    hex: string;
}

interface VariantsFormProps {
    uploadedImages: string[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    availableColors: ColorOption[];
    selectedColors: string[];
    onToggleColor: (colorName: string) => void;
    availableSizes: string[];
    selectedSizes: string[];
    onToggleSize: (size: string) => void;
}

const VariantsForm = ({
    uploadedImages,
    onUpload,
    onRemoveImage,
    availableColors,
    selectedColors,
    onToggleColor,
    availableSizes,
    selectedSizes,
    onToggleSize,
}: VariantsFormProps) => {
    return (
        <div className="space-y-8">
            <div>
                <label className="block text-base font-medium text-neutral-900 mb-3">Product Images</label>
                <label className="w-full border-2 border-dashed border-neutral-300 rounded-lg p-10 text-center cursor-pointer hover:border-neutral-400 transition-colors flex flex-col items-center justify-center gap-2">
                    <input
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
                                    className="relative w-48 h-48 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden flex-shrink-0"
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {availableColors.map((color) => (
                        <label key={color.name} className="flex items-center gap-3 cursor-pointer">
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
                            return (
                                <div
                                    key={colorName}
                                    className="px-4 py-2 rounded-full text-white font-medium text-sm flex items-center gap-2"
                                    style={{ backgroundColor: color?.hex }}
                                >
                                    {colorName}
                                </div>
                            );
                        })}
                    </div>
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
        </div>
    );
};

export default VariantsForm;