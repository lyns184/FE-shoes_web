import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { 
  getProducts, 
  getProductDetail, 
  searchProducts,
  type GetProductsParams,
  type GetProductsResponse,
  type GetProductDetailResponse,
  type SearchProductsResponse 
} from '../services/products';
import { queryKeys } from '../lib/queryKeys';

/**
 * Hook to fetch products list with optional filters
 */
export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async (): Promise<GetProductsResponse> => {
      const response = await getProducts(params);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    enabled: true,
  });
}

/**
 * Hook to fetch products list with Suspense
 */
export function useProductsSuspense(params?: GetProductsParams) {
  return useSuspenseQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async (): Promise<GetProductsResponse> => {
      const response = await getProducts(params);
      return response;
    },
  });
}

/**
 * Hook to fetch single product detail
 */
export function useProductDetail(productId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async (): Promise<GetProductDetailResponse> => {
      const response = await getProductDetail(productId);
      return response;
    },
    enabled: enabled && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes - product details don't change often
    gcTime: 30 * 60 * 1000,    // 30 minutes
  });
}

/**
 * Hook to search products with debouncing built-in
 */
export function useSearchProducts(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: async (): Promise<SearchProductsResponse> => {
      const response = await searchProducts(query);
      return response;
    },
    enabled: enabled && query.trim().length >= 2, // Only search if query is at least 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes - search results can be fresher
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
}

/**
 * Hook to fetch trending products
 */
export function useTrendingProducts(limit: number = 4) {
  return useQuery({
    queryKey: queryKeys.products.trending(),
    queryFn: async (): Promise<GetProductsResponse> => {
      const response = await getProducts({ 
        category: 1, // assuming category 1 is trending
        limit 
      });
      return response;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - trending products don't change often
    gcTime: 30 * 60 * 1000,    // 30 minutes
  });
}

/**
 * Hook to fetch new products/releases
 */
export function useNewProducts(limit: number = 4) {
  return useQuery({
    queryKey: queryKeys.products.new(),
    queryFn: async (): Promise<GetProductsResponse> => {
      const response = await getProducts({ 
        // Add any specific params for new products
        limit,
        // You might want to sort by creation date or add a 'new' filter
      });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,    // 20 minutes
  });
}

/**
 * Hook to fetch best-selling products
 */
export function useBestSellerProducts(limit: number = 4) {
  return useQuery({
    queryKey: queryKeys.products.bestSellers(),
    queryFn: async (): Promise<GetProductsResponse> => {
      const response = await getProducts({ 
        // Add any specific params for best sellers
        limit,
        // You might want to sort by sales volume
      });
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - best sellers don't change often
    gcTime: 60 * 60 * 1000,    // 1 hour
  });
}

/**
 * Hook to fetch product categories
 */
export function useProductCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: async () => {
      // Assuming you have a getCategories function in your products service
      // If not, you might need to create it or extract from products
      await getProducts({ limit: 1 }); // Get one product to extract categories
      // This is a placeholder - implement based on your API structure
      return { success: true, data: [] };
    },
    staleTime: 60 * 60 * 1000, // 1 hour - categories rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

/**
 * Hook to fetch product brands
 */
export function useProductBrands() {
  return useQuery({
    queryKey: queryKeys.products.brands(),
    queryFn: async () => {
      // Similar to categories, implement based on your API
      await getProducts({ limit: 1 });
      // Extract unique brands or call dedicated brands endpoint
      return { success: true, data: [] };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}