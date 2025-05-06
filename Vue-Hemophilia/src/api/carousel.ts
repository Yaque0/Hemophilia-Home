import request from "@/utils/request";
import { AxiosResponse } from "axios";
import type { Carousel, CarouselResponse } from "@/types/carousel";

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
