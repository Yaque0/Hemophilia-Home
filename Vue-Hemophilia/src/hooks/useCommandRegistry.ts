// useCommandRegistry.ts
import { onMounted, onBeforeUnmount } from "vue";
import type { EditorCommand } from "@/components/yEditor/types";

type KeyboardCommand = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  command: EditorCommand;
  execute: () => void;
};

const commands: KeyboardCommand[] = [];

// 注册键盘命令
export function registerKeyboardCommand(
  p0: string,
  handleFileSelect: (e: Event) => void,
  cmd: KeyboardCommand,
) {
  commands.push(cmd);
}

// 根据键盘事件获取命令
export function getCommandByKey(
  event: KeyboardEvent,
): KeyboardCommand | undefined {
  return commands.find(
    (cmd) =>
      cmd.key.toLowerCase() === event.key.toLowerCase() &&
      !!cmd.ctrl === event.ctrlKey &&
      !!cmd.shift === event.shiftKey &&
      !!cmd.alt === event.altKey,
  );
}

// 注册键盘命令
export function useCommandRegistry(editorEl?: HTMLElement) {
  const executeCommandByKey = (event: KeyboardEvent) => {
    const cmd = getCommandByKey(event);
    if (cmd) {
      event.preventDefault();
      cmd.execute();
    }
  };
  const handleEnterFix = (event: KeyboardEvent) => {
    if (event.key === "Enter" && editorEl) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const paragraph =
        container.nodeType === 3
          ? container.parentElement
          : (container as HTMLElement);

      if (paragraph?.tagName === "P" && paragraph.innerHTML.trim() === "<br>") {
        event.preventDefault();

        // 创建新段落
        const newP = document.createElement("p");
        newP.innerHTML = "<br>";
        paragraph.parentElement?.insertBefore(newP, paragraph.nextSibling);

        // 设置光标
        const newRange = document.createRange();
        newRange.setStart(newP, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  onMounted(() => {
    document.addEventListener("keydown", executeCommandByKey);
    document.addEventListener("keydown", handleEnterFix);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", executeCommandByKey);
    document.removeEventListener("keydown", handleEnterFix);
  });

  return {
    executeCommandByKey,
    registerKeyboardCommand,
  };
}
