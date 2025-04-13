import DOMPurify from "dompurify";
import { SanitizeConfig } from "./types";

// XSS 过滤
export const sanitizeHTML = (dirty: string, config?: SanitizeConfig) => {
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
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "style", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(https?|data):/i,
  };

  return DOMPurify.sanitize(dirty, {
    ...baseConfig,
    ...config,
    ADD_ATTR: ["target", "rel"],
    FORBID_TAGS: ["style", "script"],
    FORBID_ATTR: ["onclick"],
  });
};

// 安全链接处理
export const safeLinks = (html: string) => {
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
};

// 增强选区管理
export const preserveSelection = (rootEl: HTMLElement) => {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;

  const range = sel.getRangeAt(0);

  const getPath = (node: Node) => {
    const path = [];
    let current = node;
    while (current !== rootEl) {
      const parent = current.parentNode;
      if (!parent) break;
      path.unshift(Array.from(parent.childNodes).indexOf(current as ChildNode));
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
      const newRange = document.createRange();
      const startNode = findNodeByPath(startPath, rootEl);
      const endNode = findNodeByPath(endPath, rootEl);

      if (startNode && endNode) {
        newRange.setStart(startNode, startOffset);
        newRange.setEnd(endNode, endOffset);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    },
  };
};

const findNodeByPath = (path: number[], root: HTMLElement) => {
  return path.reduce((node: Node | null, index) => {
    return node?.childNodes[index] || null;
  }, root);
};
