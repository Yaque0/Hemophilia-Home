// plugins.ts
import type { EditorPlugin } from "./types";

// 创建图片上传插件，接收上传处理函数和可选的配置参数
export const createImageUploadPlugin = (
  uploadHandler: (file: File) => Promise<string>, // 上传处理函数，接收文件并返回上传后的 URL
  options?: {
    accept?: string; // 指定可上传的文件类型，默认为 "image/*"
    maxSize?: number; // 限制最大文件大小，单位为字节
  },
): EditorPlugin => {
  let input: HTMLInputElement | null = null;

  return {
    install(el) {
      try {
        input = createUploadInput(el, uploadHandler, options);
        el.addEventListener("trigger-image-upload", () => input?.click());
      } catch (err) {
        console.error("Image upload plugin installation error:", err);
      }
    },

    uninstall() {
      try {
        input?.remove();
        input = null;
      } catch (err) {
        console.error("Image upload plugin uninstallation error:", err);
      }
    },
  };
};

// 创建文件上传的 input 元素
const createUploadInput = (
  el: HTMLElement, // 编辑器元素
  uploadHandler: any, // 上传处理函数
  options?: any, // 配置选项
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = options?.accept || "image/*";
  input.style.display = "none";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    if (options?.maxSize && file.size > options.maxSize) {
      el.dispatchEvent(
        new CustomEvent("upload-error", {
          detail: `文件大小超过${options.maxSize / 1024 / 1024}MB限制`,
        }),
      );
      return;
    }

    try {
      const url = await uploadHandler(file);
      el.dispatchEvent(new CustomEvent("insert-image", { detail: url }));
    } catch (err) {
      el.dispatchEvent(new CustomEvent("upload-error", { detail: err }));
    }
  };

  document.body.appendChild(input);
  return input;
};
