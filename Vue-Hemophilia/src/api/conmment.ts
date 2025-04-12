import request from "@/utils/request";

export interface CommentData {
  postId: number;
  content: string;
  parentId?: number | null; // 可为空或null，表示这是一级评论或者没有父评论
}

export interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface FullComment {
  id: number;
  content: string;
  postId: number;
  parentId?: number | null;
  user: User;
  replies?: FullComment[]; // 嵌套子评论
  createdAt: string;
}

// 获取评论列表
export const getPostComments = (
  postId: number,
  params?: { page?: number; limit?: number },
): Promise<{
  data: {
    comments: FullComment[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
}> => {
  return request.get(`/comments/post/${postId}`, { params });
};

// 创建评论
export const createComment = (data: CommentData) => {
  return request.post("/comments", data);
};

// 删除评论
export const deleteComment = (id: number) => {
  return request.delete(`/comments/${id}`);
};
