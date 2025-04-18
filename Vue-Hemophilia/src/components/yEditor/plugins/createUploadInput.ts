export const createUploadInput = (
  el: HTMLElement,
  uploadHandler: (file: File) => Promise<string>,
  options?: {
    accept?: string;
    maxSize?: number;
  },
): HTMLInputElement => {
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
          detail: `文件大小超过${(options.maxSize / 1024 / 1024).toFixed(
            2,
          )}MB限制`,
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
