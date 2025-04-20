import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  user: User; // 使用统一的User类型
  createdAt: string;
  parentId?: number | null; // 添加parentId字段
  postId?: number; // 可选，部分场景需要
}

export interface CommentData {
  postId: number;
  content: string;
  parentId?: number | null; // 可选，用于回复;
}

export interface FullComment extends Comment {
  replies?: FullComment[]; // 嵌套子评论
}

export interface CommentListResponse {
  comments: FullComment[];
  total: number;
  currentPage: number;
  totalPages: number;
}
