import type { EditorPlugin } from "./types";

// 创建图片上传插件，接收上传处理函数和可选的配置参数
export const createImageUploadPlugin = (
  uploadHandler: (file: File) => Promise<string>, // 上传处理函数，接收文件并返回上传后的 URL
  options?: {
    // 可选的配置参数
    accept?: string; // 指定可上传的文件类型，默认为 "image/*"（所有图片类型）
    maxSize?: number; // 限制最大文件大小，单位为字节
  },
): EditorPlugin => {
  let input: HTMLInputElement | null = null; // 保存文件选择 input 元素的引用

  return {
    // 安装插件的方法
    install(el) {
      // 创建文件上传 input 元素，并将其添加到编辑器中
      input = createUploadInput(el, uploadHandler, options);
      // 监听自定义事件 "trigger-image-upload"，触发时模拟点击上传按钮
      el.addEventListener("trigger-image-upload", () => input?.click());
    },

    // 卸载插件的方法
    uninstall() {
      // 删除上传 input 元素，清除引用，避免内存泄漏
      input?.remove();
      input = null;
    },
  };
};

// 创建文件上传的 input 元素
const createUploadInput = (
  el: HTMLElement, // 编辑器元素
  uploadHandler: any, // 上传处理函数
  options?: any, // 配置选项
) => {
  // 创建一个隐藏的文件选择 input 元素
  const input = document.createElement("input");
  input.type = "file"; // 设置类型为 file
  input.accept = options?.accept || "image/*"; // 设置文件类型，默认为 image/*
  input.style.display = "none"; // 隐藏 input 元素

  // 监听文件选择变化事件
  input.onchange = async () => {
    const file = input.files?.[0]; // 获取用户选择的文件
    if (!file) return; // 如果没有选择文件，直接返回

    // 检查文件大小是否符合要求
    if (options?.maxSize && file.size > options.maxSize) {
      // 如果文件超出最大限制，触发 upload-error 事件
      el.dispatchEvent(
        new CustomEvent("upload-error", {
          detail: `文件大小超过${options.maxSize / 1024 / 1024}MB限制`, // 错误信息
        }),
      );
      return;
    }

    try {
      // 调用上传处理函数上传文件，返回图片 URL
      const url = await uploadHandler(file);
      // 上传成功后，触发 insert-image 事件，传递上传后的图片 URL
      el.dispatchEvent(new CustomEvent("insert-image", { detail: url }));
    } catch (err) {
      // 上传失败时，触发 upload-error 事件，传递错误信息
      el.dispatchEvent(new CustomEvent("upload-error", { detail: err }));
    }
  };

  // 将 input 元素添加到页面 body 中，确保可以选择文件
  document.body.appendChild(input);
  return input;
};
