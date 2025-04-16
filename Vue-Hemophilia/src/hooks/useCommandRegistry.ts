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

export function registerKeyboardCommand(
  p0: string,
  handleFileSelect: (e: Event) => void,
  cmd: KeyboardCommand,
) {
  commands.push(cmd);
}

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

export function useCommandRegistry(editorEl?: HTMLElement) {
  const executeCommandByKey = (event: KeyboardEvent) => {
    const cmd = getCommandByKey(event);
    if (cmd) {
      event.preventDefault();
      cmd.execute();
    }
  };

  onMounted(() => {
    document.addEventListener("keydown", executeCommandByKey);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", executeCommandByKey);
  });

  return {
    executeCommandByKey,
    registerKeyboardCommand,
  };
}
