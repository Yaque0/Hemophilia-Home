import request from "@/utils/request";

export const getHotNews = (params?: any) => {
  return request.get("/news", { params });
};

export const getNewsList = (params: {
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  return request.get("/news", { params });
};

export const getNewsDetail = (id: number) => {
  return request.get(`/news/${id}`);
};

export const createNews = (data: any) => {
  return request.post("/news", data);
};

export const likeNews = (id: number) => {
  return request.post(`/news/${id}/like`);
};
