import { User } from "./user";

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

export interface PostAttributes {
  id?: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  views: number;
  likes: number;
  status: number;
}
