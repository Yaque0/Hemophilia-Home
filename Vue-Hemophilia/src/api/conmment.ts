import request from "@/utils/request";

// 评论模型
export interface CommentData {
  postId: number;
  content: string;
}

// 获取评论列表
export const getPostComments = (
  postId: number,
  params?: { page: number; limit: number },
) => {
  return request.get(`/posts/${postId}/comments`, { params });
};

// 创建评论
export const createComment = (data: CommentData) => {
  return request.post("/comments", data);
};

// 删除评论
export const deleteComment = (id: number) => {
  return request.delete(`/comments/${id}`);
};
