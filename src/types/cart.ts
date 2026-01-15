export interface CartItem {
  id: number;              // cart item id or product id for local cart
  productVariantID?: number; // The variant ID (size + color combination)
  productID?: number;      // The product ID
  name: string;
  description?: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  thumbnail: string;
}