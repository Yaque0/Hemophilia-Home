import DOMPurify from "dompurify";
import { SanitizeConfig } from "@/components/yEditor/types";

// XSS 过滤
export const sanitizeHTML = (dirty: string, config?: SanitizeConfig) => {
  try {
    const baseConfig = {
      ALLOWED_TAGS: [
        "p",
        "b",
        "strong",
        "i",
        "em",
        "img",
        "br",
        "ul",
        "ol",
        "li",
        "a",
        "div",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "style",
        "target",
        "rel",
        "data-align",
        "class",
      ],
      ALLOWED_URI_REGEXP: /^(https?|data):/i,
    };

    return DOMPurify.sanitize(dirty, {
      ...baseConfig,
      ...config,
      ADD_ATTR: ["target", "rel"],
      FORBID_TAGS: ["style", "script"],
      FORBID_ATTR: ["onclick"],
    });
  } catch (err) {
    console.error("Sanitization error:", err);
    return dirty;
  }
};

// 安全链接处理
export const safeLinks = (html: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("a").forEach((a) => {
      if (!a.href.startsWith("http")) {
        a.removeAttribute("href");
      }
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error("Link processing error:", err);
    return html; // fallback to raw input if processing fails
  }
};

// 增强选区管理
export const preserveSelection = (rootEl: HTMLElement) => {
  try {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return null;

    const range = sel.getRangeAt(0);

    const getPath = (node: Node) => {
      const path = [];
      let current = node;
      while (current !== rootEl && current.parentNode) {
        const parent = current.parentNode;
        if (!parent) break;
        path.unshift(
          Array.from(parent.childNodes).indexOf(current as ChildNode),
        );
        current = parent;
      }
      return path;
    };

    const startPath = getPath(range.startContainer);
    const endPath = getPath(range.endContainer);
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    return {
      startPath,
      startOffset,
      endPath,
      endOffset,

      restore: () => {
        try {
          const newRange = document.createRange();
          const selection = window.getSelection();
          if (!selection) return;

          // 安全地查找起始节点
          let startNode: Node | null = rootEl;
          for (const index of startPath) {
            if (!startNode?.childNodes[index]) break;
            startNode = startNode.childNodes[index];
          }

          // 安全地查找结束节点
          let endNode: Node | null = rootEl;
          for (const index of endPath) {
            if (!endNode?.childNodes[index]) break;
            endNode = endNode.childNodes[index];
          }

          // 计算安全偏移量
          const safeStartOffset = startNode
            ? Math.min(startOffset, getNodeLength(startNode))
            : 0;

          const safeEndOffset = endNode
            ? Math.min(endOffset, getNodeLength(endNode))
            : 0;

          // 设置范围
          if (startNode) {
            newRange.setStart(startNode, safeStartOffset);
          } else {
            newRange.setStart(rootEl, 0);
          }

          if (endNode) {
            newRange.setEnd(endNode, safeEndOffset);
          } else {
            newRange.setEnd(rootEl, 0);
          }

          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (error) {
          console.error(
            "Selection restoration failed, falling back to end:",
            error,
          );
          // 回退方案：将光标放在末尾
          const range = document.createRange();
          range.selectNodeContents(rootEl);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      },
    };
  } catch (err) {
    console.error("Selection preservation error:", err);
    return null; // fallback to null if selection preservation fails
  }
};

// 恢复选区
const findNodeByPath = (path: number[], root: HTMLElement) => {
  return path.reduce((node: Node | null, index) => {
    return node?.childNodes[index] || null;
  }, root);
};

// 获取节点长度
const getNodeLength = (node: Node): number => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.length || 0;
  } else {
    return node.childNodes.length;
  }
};

// 获取节点路径
export const getNodePath = (root: Node, target: Node) => {
  const path: number[] = [];
  let node = target;
  while (node && node !== root) {
    const parent = node.parentNode;
    if (parent) {
      path.unshift(Array.prototype.indexOf.call(parent.childNodes, node));
      node = parent;
    }
  }
  return path;
};

// 根据路径获取节点
export const getNodeFromPath = (root: Node, path: number[]): Node | null => {
  let node: Node | null = root;
  for (const index of path) {
    if (!node || !node.childNodes) {
      return null;
    }
    node = node.childNodes[index] || null;
  }
  return node;
};

export const getSelectionInfo = (editor: HTMLElement) => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  return {
    startContainerPath: getNodePath(editor, range.startContainer),
    startOffset: range.startOffset,
    endContainerPath: getNodePath(editor, range.endContainer),
    endOffset: range.endOffset,
  };
};

export const restoreSelection = (
  editor: HTMLElement,
  selection: {
    startContainerPath: number[];
    startOffset: number;
    endContainerPath: number[];
    endOffset: number;
  },
) => {
  const range = document.createRange();
  const startContainer = getNodeFromPath(editor, selection.startContainerPath);
  const endContainer = getNodeFromPath(editor, selection.endContainerPath);

  if (startContainer && endContainer) {
    range.setStart(startContainer, selection.startOffset);
    range.setEnd(endContainer, selection.endOffset);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};
