import request from "@/utils/request";

// 定义商品数据类型
export interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// 定义商品查询类型
export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  keyword?: string;
}

// 获取商品列表
export const getProducts = (params?: ProductQuery) => {
  return request.get("/products", { params });
};

// 获取商品详情
export const getProductDetail = (id: number) => {
  return request.get(`/products/${id}`);
};
