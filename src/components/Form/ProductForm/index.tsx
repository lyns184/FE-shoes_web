'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import BasicInfoForm from './BasicInfoForm';
import VariantsForm from './VariantsForm';
import { createProduct, createVariants, updateProduct, getAllColors, type CreateProductPayload, type UpdateProductPayload, type VariantInput, type Color } from '../../../services/product';

export interface ProductFormProps {
  mode?: 'create' | 'edit';
  productId?: string | number;
  productName?: string;
  brand?: string;
  price?: number;
  discount?: number;
  categories?: string[];
  description?: string;
  status?: 'Active' | 'Inactive';
  images?: string[];
  variants?: Variant[];
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
}

export interface Variant {
  color: { label: string; hex: string; id?: number };
  size: number;
  quantity: number;
}

export interface ProductFormData {
  productName: string;
  brand: string;
  price: number;
  discount: number;
  categories: string[];
  description: string;
  status: 'Active' | 'Inactive';
  images: string[];
  variants: Variant[];
}

const AVAILABLE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43'];

const ProductFrom = ({
  mode = 'create',
  productId,
  productName = '',
  brand = '',
  price = 0.0,
  discount = 0,
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
  const queryClient = useQueryClient();

  // Fetch colors from API
  const { data: colorsData } = useQuery({
    queryKey: ['colors'],
    queryFn: getAllColors,
  });

  const availableColors = useMemo<Color[]>(() => colorsData?.data || [], [colorsData]);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const createVariantsMutation = useMutation({
    mutationFn: createVariants,
    onSuccess: () => {
      // Only invalidate products query after variants are created successfully
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Basic Info state
  const [formData, setFormData] = useState<ProductFormData>({
    productName,
    brand,
    price,
    discount,
    categories,
    description,
    status,
    images,
    variants,
  });

  // Variants state
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>(images);
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
      discount,
      categories,
      description,
      status,
      images,
      variants,
    });
    setUploadedImages(images);
    setThumbnailFiles([]);
    setRemovedPublicIds([]);
    setOriginalImages(images);
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
      const colorObj = availableColors.find(c => c.name === colorName);
      if (colorObj) {
        sizes.forEach(size => {
          const sizeNum = parseInt(size);
          const existing = variantsLocal.find(
            v => v.color.label === colorName && v.size === sizeNum
          );
          newVariants.push({
            color: { label: colorObj.name, hex: colorObj.hex, id: colorObj.id },
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
      const filesArray = Array.from(files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 8));
      setThumbnailFiles(prev => [...prev, ...filesArray].slice(0, 8));
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = uploadedImages[index];
    
    // Check if this is an original image (from API)
    if (originalImages.includes(imageUrl)) {
      // Extract public_id from Cloudinary URL
      // Format: https://res.cloudinary.com/.../CloudinaryShoeStore/filename.jpg
      const match = imageUrl.match(/\/CloudinaryShoeStore\/[^\/]+/);
      if (match) {
        const publicId = match[0].substring(1); // Remove leading '/'
        setRemovedPublicIds(prev => [...prev, publicId]);
      }
    }
    
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setThumbnailFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isSubmitting = createProductMutation.isPending || createVariantsMutation.isPending || updateProductMutation.isPending;

  const handleUpdate = async () => {
    if (!productId) {
      toast.error('Product ID is required for update');
      return;
    }

    const brandId = Number(formData.brand);
    if (!Number.isFinite(brandId)) {
      toast.error('Brand ID must be a number');
      return;
    }

    const updatePayload: UpdateProductPayload = {
      name: formData.productName,
      description: formData.description,
      price: formData.price,
      active: formData.status === 'Active',
      brandID: brandId,
      category: formData.categories,
      discount: formData.discount > 0 ? formData.discount / 100 : undefined,
      thumbnailFiles: thumbnailFiles.length > 0 ? thumbnailFiles : undefined,
      remove_public_id: removedPublicIds.length > 0 ? removedPublicIds : undefined,
    };

    const finalData: ProductFormData = {
      ...formData,
      images: uploadedImages,
      variants: variantsLocal,
    };

    try {
      const toastId = toast.loading('Updating product...');

      const productResult = await updateProductMutation.mutateAsync({
        id: Number(productId),
        payload: updatePayload,
      });

      if (!productResult.success) {
        toast.error(productResult.message || 'Failed to update product', { id: toastId });
        return;
      }

      toast.success('Product updated successfully!', { id: toastId });
      onSubmit?.(finalData);
      onCancel?.();
    } catch (err) {
      toast.error('An unexpected error occurred while updating the product.');
      console.error('Failed to update product:', err);
    }
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      await handleUpdate();
      return;
    }
    if (selectedColorsLocal.length === 0 || selectedSizesLocal.length === 0) {
      toast.error('Please select at least one color and one size');
      return;
    }

    const brandId = Number(formData.brand);
    if (!Number.isFinite(brandId)) {
      toast.error('Brand ID must be a number');
      return;
    }

    const missingColorId = variantsLocal.some(v => v.color.id == null);
    if (missingColorId) {
      toast.error('Each variant needs a color ID to create variants.');
      return;
    }

    const productPayload: CreateProductPayload = {
      name: formData.productName,
      description: formData.description,
      price: formData.price,
      active: formData.status === 'Active',
      brandID: brandId,
      category: formData.categories,
      discount: formData.discount > 0 ? formData.discount / 100 : undefined,
      thumbnailFiles,
    };

    const finalData: ProductFormData = {
      ...formData,
      images: uploadedImages,
      variants: variantsLocal,
    };

    try {
      const toastId = toast.loading('Creating product...');

      const productResult = await createProductMutation.mutateAsync(productPayload);

      if (!productResult.success || !productResult.data) {
        toast.error(productResult.message || 'Failed to create product', { id: toastId });
        return;
      }

      if (variantsLocal.length > 0) {
        toast.loading('Creating variants...', { id: toastId });

        const variantsPayload: VariantInput[] = variantsLocal.map(v => ({
          size: v.size,
          quantity: v.quantity,
          colorID: v.color.id as number,
        }));

        const variantsResult = await createVariantsMutation.mutateAsync({
          productID: productResult.data.id,
          variants: variantsPayload,
        });

        if (!variantsResult.success) {
          toast.error(variantsResult.message || 'Failed to create variants', { id: toastId });
          return;
        }
      }

      toast.success('Product created successfully!', { id: toastId });
      onSubmit?.(finalData);
      onCancel?.();
    } catch (err) {
      toast.error('An unexpected error occurred while creating the product.');
      console.error('Failed to submit product:', err);
    }
  };

  const isSubmitDisabled =
    selectedColorsLocal.length === 0 ||
    selectedSizesLocal.length === 0 ||
    isSubmitting;

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
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
          {isSubmitting ? 'Processing...' : isEditMode ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductFrom;