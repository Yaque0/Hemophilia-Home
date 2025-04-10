import request from "@/utils/request";
import { AxiosResponse } from "axios";

// 轮播图模型
export interface Carousel {
  id: number;
  image: string;
  link: string;
  sorOrder: number;
  title: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}
// 轮播图响应数据
export interface CarouselResponse {
  message: string;
  carousel: Carousel[];
  total: number;
  currentPage: number;
  totalPages: number;
}
export const addCarousel = (data: Carousel) => {
  return request.post("/carousels", data);
};

export const getCarouselList = (): Promise<AxiosResponse<CarouselResponse>> => {
  return request.get("/carousels");
};
export const updateCarousel = (id: number, data: Carousel) => {
  return request.put(`/carousels/${id}`, data);
};

export const removeCarousel = (id: number) => {
  return request.delete(`/carousels/${id}`);
};
