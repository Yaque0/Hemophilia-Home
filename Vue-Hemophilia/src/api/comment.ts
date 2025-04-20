import request from "@/utils/request";
import type { CommentData, FullComment } from "@/types/comment";
import type { User } from "@/types/user";

// 获取评论列表
export const getPostComments = (
  postId: number,
  params?: {
    page?: number;
    limit?: number;
    depth?: number;
  },
) => {
  return request.get(`/comments/post/${postId}`, { params });
};
export const getDeepComments = (
  parentId: number,
  params?: {
    page?: number;
    limit?: number;
  },
) => {
  return request.get(`/comments/deep/${parentId}`, { params });
};
// 创建评论
export const createComment = (data: CommentData) => {
  return request.post("/comments", data);
};

// 删除评论
export const deleteComment = (id: number) => {
  return request.delete(`/comments/${id}`);
};
