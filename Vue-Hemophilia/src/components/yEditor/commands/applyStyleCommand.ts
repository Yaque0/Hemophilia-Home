import type { EditorPlugin } from "../types";
import { applyInlineStyle, applyBlockStyle } from "./applyStyle";
export interface StyleCommandOptions {
  styleName: string;
  styleValue: string;
  isBlock?: boolean;
}
export const createApplyStyleCommand = ({
  styleName,
  styleValue,
  isBlock = false,
}: StyleCommandOptions): EditorPlugin => {
  return {
    install(el) {
      el.addEventListener("exec-command", (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.command === "apply-style") {
          isBlock
            ? applyBlockStyle(styleName, styleValue)
            : applyInlineStyle(styleName, styleValue);
        }
      });
    },
    uninstall() {},
  };
};
