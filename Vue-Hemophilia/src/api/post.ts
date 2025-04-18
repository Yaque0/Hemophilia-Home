import request from "@/utils/request";

export interface PostData {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  category: string;
  views: number;
  createdAt: Date;
}

//获取帖子列表
export const getPosts = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  keyword?: string;
}) => {
  return request.get("/posts", { params });
};

//获取帖子详情
export const getPostDetail = (id: number) => {
  return request.get(`/posts/${id}`);
};
//创建帖子
export const createPost = (data: PostData) => {
  return request.post("/posts", data);
};
