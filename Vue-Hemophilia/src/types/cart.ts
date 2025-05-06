export interface CartItemData {
  id?: number;
  productId: number;
  quantity: number;
  product?: {
    id?: number;
    name?: string;
    price?: number;
    stock?: number;
    image?: string;
  };
}
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
}
