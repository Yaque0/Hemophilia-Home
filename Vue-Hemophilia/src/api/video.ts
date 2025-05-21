import request from "@/utils/request";
import type { Video, VideoUploadInit } from "@/types/video"; // 假设已定义类型

// 初始化分片上传
export const initVideoUpload = (data: {
  fileSize: number;
  chunkSize: number;
}) => {
  return request.post<VideoUploadInit>("/videos/upload/init", data);
};

// 上传文件分片
export const uploadVideoChunk = (
  params: {
    uploadId: string;
    chunkIndex: number;
    chunk: File;
    totalChunks: number; //总块数计算进度
  },
  onProgress?: (progress: number) => void, //进度回调
) => {
  const formData = new FormData();
  formData.append("chunk", params.chunk);
  formData.append("uploadId", params.uploadId);
  formData.append("chunkIndex", params.chunkIndex.toString());
  formData.append("totalChunks", params.totalChunks.toString());

  return request.post("/videos/upload/chunk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(progress);
      }
    },
  });
};
// 合并分片
export const mergeVideoChunks = (data: {
  uploadId: string;
  fileName: string;
  title: string;
  cover: string;
  userId: number;
}) => {
  return request.post<Video>("/videos/upload/merge", data);
};

// 获取视频列表
export const getVideoList = () => {
  return request.get<Video[]>("/videos");
};

// 删除视频
export const deleteVideo = (id: number) => {
  return request.delete(`/videos/${id}`);
};
