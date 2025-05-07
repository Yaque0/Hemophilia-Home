import request from "@/utils/request";
import type { CartItemData } from "@/types/cart";

// 加入购物车
export const addToCart = (
  data: CartItemData,
  p0: { headers: { Authorization: string } },
) => {
  return request.post("/cart", data);
};

// 获取购物车列表
export const getCartList = () => {
  return request.get("/cart");
};

// 更新购物车商品数量
export const updateCartItemQuantity = (id: number, quantity: number) => {
  return request.put(`/cart/${id}/quantity`, { quantity });
};

// 删除购物车商品
export const removeFromCart = (id: number) => {
  return request.delete(`/cart/${id}`);
};
