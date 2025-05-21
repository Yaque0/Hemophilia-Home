export interface Video {
  id: number;
  title: string;
  cover: string;
  url: string;
  description?: string;
  userId: number;
  status: number;
  createdAt: string;
}

export interface VideoUploadInit {
  uploadId: string;
  chunkCount: number;
}
