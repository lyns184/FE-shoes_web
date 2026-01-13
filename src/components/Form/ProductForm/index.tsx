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
  categories?: string[];
  description?: string;
  status?: 'Active' | 'Inactive';
  images?: string[];
  variants?: Variant[];
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
}

export interface Variant {
  color: { label: string; hex: string };
  size: number;
  quantity: number;
}

export interface ProductFormData {
  productName: string;
  brand: string;
  price: number;
  categories: string[];
  description: string;
  status: 'Active' | 'Inactive';
  images: string[];
  variants: Variant[];
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
  categories = [],
  description = '',
  status = 'Active',
  images = [],
  variants = [],
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
    categories,
    description,
    status,
    images,
    variants,
  });

  // Variants state
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const [selectedColorsLocal, setSelectedColorsLocal] = useState<string[]>(
    Array.from(new Set(variants.map(v => v.color.label)))
  );
  const [selectedSizesLocal, setSelectedSizesLocal] = useState<string[]>(
    Array.from(new Set(variants.map(v => v.size.toString()))).sort((a, b) => parseInt(a) - parseInt(b))
  );
  const [variantsLocal, setVariantsLocal] = useState<Variant[]>(variants);

  // Keep form state in sync only when switching between products (productId) or modes
  // This prevents resetting the form while user is typing or selecting colors/sizes
  useEffect(() => {
    setFormData({
      productName,
      brand,
      price,
      categories,
      description,
      status,
      images,
      variants,
    });
    setUploadedImages(images);
    setSelectedColorsLocal(Array.from(new Set(variants.map(v => v.color.label))));
    setSelectedSizesLocal(Array.from(new Set(variants.map(v => v.size.toString()))).sort((a, b) => parseInt(a) - parseInt(b)));
    setVariantsLocal(variants);
  }, [productId, mode]);

  const handleBasicInfoChange = (field: keyof Omit<ProductFormData, 'images' | 'variants'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorToggle = (colorName: string) => {
    const newColors = selectedColorsLocal.includes(colorName)
      ? selectedColorsLocal.filter(c => c !== colorName)
      : [...selectedColorsLocal, colorName];
    setSelectedColorsLocal(newColors);
    regenerateVariants(newColors, selectedSizesLocal);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizesLocal.includes(size)
      ? selectedSizesLocal.filter(s => s !== size)
      : [...selectedSizesLocal, size];
    setSelectedSizesLocal(newSizes);
    regenerateVariants(selectedColorsLocal, newSizes);
  };

  const regenerateVariants = (colors: string[], sizes: string[]) => {
    const newVariants: Variant[] = [];
    colors.forEach(colorName => {
      const colorObj = AVAILABLE_COLORS.find(c => c.name === colorName);
      if (colorObj) {
        sizes.forEach(size => {
          const sizeNum = parseInt(size);
          const existing = variantsLocal.find(
            v => v.color.label === colorName && v.size === sizeNum
          );
          newVariants.push({
            color: { label: colorObj.name, hex: colorObj.hex },
            size: sizeNum,
            quantity: existing?.quantity ?? 0,
          });
        });
      }
    });
    setVariantsLocal(newVariants);
  };

  const handleQuantityChange = (colorLabel: string, size: number, quantity: number) => {
    setVariantsLocal(prev =>
      prev.map(v =>
        v.color.label === colorLabel && v.size === size
          ? { ...v, quantity }
          : v
      )
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
    if (selectedColorsLocal.length === 0 || selectedSizesLocal.length === 0) {
      alert('Please select at least one color and one size');
      return;
    }
    const finalData: ProductFormData = {
      ...formData,
      images: uploadedImages,
      variants: variantsLocal,
    };
    onSubmit?.(finalData);
  };

  const isSubmitDisabled = selectedColorsLocal.length === 0 || selectedSizesLocal.length === 0;

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
          variants={variantsLocal}
          onQuantityChange={handleQuantityChange}
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
          disabled={isSubmitDisabled}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isSubmitDisabled
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'bg-[#396254] text-white hover:bg-[#2d4a3f] cursor-pointer'
          }`}
        >
          {isEditMode ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductFrom;