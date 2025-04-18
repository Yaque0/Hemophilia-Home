export const applyStyle = (styleName: string, styleValue: string) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.style.setProperty(styleName, styleValue);
  span.appendChild(range.extractContents());
  range.insertNode(span);

  // 重新选中插入后的 span 内容
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.addRange(newRange);
};

//用于字体颜色、字体大小等样式的应用
export const applyInlineStyle = (styleName: string, styleValue: string) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.style.setProperty(styleName, styleValue);
  span.appendChild(range.extractContents());
  range.insertNode(span);

  // 重新选中插入后的 span 内容
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.addRange(newRange);
};

//用于段落样式的应用，如对齐方式、行高等
export const applyBlockStyle = (styleName: string, styleValue: string) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  let container = range.startContainer as HTMLElement;

  // 找到父段落元素
  while (container && container.nodeType !== 1) {
    container = container.parentElement!;
  }

  const block = container.closest("p, div, li");
  if (block) {
    (block as HTMLElement).style.setProperty(styleName, styleValue);
  }
};
