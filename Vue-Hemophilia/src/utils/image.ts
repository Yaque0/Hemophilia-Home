const handlePasteUpload = async (event: ClipboardEvent) => {
  // 处理粘贴内容
  const clipboardData = event.clipboardData;
  const items = clipboardData?.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          // 上传文件并返回HTML
          const uploadedUrl = await uploadImage(file);
          return `<img src="${uploadedUrl}" />`; // 返回上传后的图像HTML
        }
      }
    }
  }
  return "";
};

// 上传图像函数
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  return result.url;
};
