'use client';

import { useEffect, useState } from 'react';
import BasicInfoForm from './BasicInfoForm';
import VariantsForm from './VariantsForm';

export interface ProductFormProps {
  mode?: 'create' | 'edit';
  productId?: string | number;
  productName?: string;
  brand?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  images?: string[];
  selectedColors?: string[];
  selectedSizes?: string[];
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
}

export interface ProductFormData {
  productName: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
  selectedColors: string[];
  selectedSizes: string[];
}

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Purple', hex: '#A855F7' },
];

const AVAILABLE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43'];

const ProductFrom = ({
  mode = 'create',
  productId,
  productName = '',
  brand = '',
  price = 0.0,
  stock = 1,
  category = '',
  description = '',
  images = [],
  selectedColors = ['Black', 'Red', 'Green'],
  selectedSizes = ['38', '39', '40'],
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'variants'>('basic');
  const isEditMode = mode === 'edit';

  // Basic Info state
  const [formData, setFormData] = useState<ProductFormData>({
    productName,
    brand,
    price,
    stock,
    category,
    description,
    images,
    selectedColors,
    selectedSizes,
  });

  // Variants state
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const [selectedColorsLocal, setSelectedColorsLocal] = useState<string[]>(selectedColors);
  const [selectedSizesLocal, setSelectedSizesLocal] = useState<string[]>(selectedSizes);

  // Keep form state in sync when initial values change (e.g., switching between products to edit)
  useEffect(() => {
    setFormData({
      productName,
      brand,
      price,
      stock,
      category,
      description,
      images,
      selectedColors,
      selectedSizes,
    });
    setUploadedImages(images);
    setSelectedColorsLocal(selectedColors);
    setSelectedSizesLocal(selectedSizes);
  }, [productName, brand, price, stock, category, description, images, selectedColors, selectedSizes]);

  const handleBasicInfoChange = (field: keyof Omit<ProductFormData, 'images' | 'selectedColors' | 'selectedSizes'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorToggle = (colorName: string) => {
    setSelectedColorsLocal(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizesLocal(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 8));
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const finalData: ProductFormData = {
      ...formData,
      images: uploadedImages,
      selectedColors: selectedColorsLocal,
      selectedSizes: selectedSizesLocal,
    };
    onSubmit?.(finalData);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-neutral-500 text-base">{isEditMode ? '' : 'Create a new product.'}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
            activeTab === 'basic'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab('variants')}
          className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
            activeTab === 'variants'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Variants
        </button>
      </div>

      {activeTab === 'basic' && (
        <BasicInfoForm
          formData={formData}
          onChange={handleBasicInfoChange}
        />
      )}

      {activeTab === 'variants' && (
        <VariantsForm
          uploadedImages={uploadedImages}
          onUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          availableColors={AVAILABLE_COLORS}
          selectedColors={selectedColorsLocal}
          onToggleColor={handleColorToggle}
          availableSizes={AVAILABLE_SIZES}
          selectedSizes={selectedSizesLocal}
          onToggleSize={handleSizeToggle}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-200">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-neutral-300 rounded-lg text-neutral-900 font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#396254] text-white rounded-lg font-medium hover:bg-[#2d4a3f] transition-colors cursor-pointer"
        >
          {isEditMode ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductFrom;