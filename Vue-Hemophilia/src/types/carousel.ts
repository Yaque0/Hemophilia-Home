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
