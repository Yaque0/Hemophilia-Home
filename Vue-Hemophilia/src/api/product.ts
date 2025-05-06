import request from "@/utils/request";

import type { ProductData, ProductQuery } from "@/types/product";

// 获取药品列表
export const getProducts = (params?: ProductQuery) => {
  return request.get("/products", { params });
};
// 获取商品详情
export const getProductDetail = async (id: number) => {
  try {
    const response = await request.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("获取商品详情失败:", error);
    throw error; // 抛出错误，由调用方处理
  }
};
// 创建商品
export const createProduct = (
  data: Omit<ProductData, "id" | "createdAt" | "updatedAt">,
) => {
  return request.post("/products", data);
};

// 更新商品
export const updateProduct = (id: number, data: Partial<ProductData>) => {
  return request.put(`/products/${id}`, data);
};

// 删除商品（软删除）
export const deleteProduct = (id: number) => {
  return request.delete(`/products/${id}`);
};
