import type { EditorPlugin } from "../types";
import { createUploadInput } from "./createUploadInput";

export const createImageUploadPlugin = (
  uploadHandler: (file: File) => Promise<string>,
  options?: {
    accept?: string;
    maxSize?: number;
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
