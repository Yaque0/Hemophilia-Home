// useEditorContext.ts
import { ref, provide, inject, Ref } from "vue";
import { useHistoryManager } from "./useHistoryManager";

const EditorContextSymbol = Symbol("EditorContext");

export interface EditorContext {
  content: Ref<string>;
  isEmpty: Ref<boolean>;
  setContent: (html: string) => void;
  handleHistory: (html: string) => void;
  undo: () => void;
  redo: () => void;
}

export function provideEditorContext(): EditorContext {
  const content = ref("");
  const isEmpty = ref(true);
  const { push, undo, redo } = useHistoryManager();

  const setContent = (html: string) => {
    content.value = html;
    isEmpty.value = html.trim() === "";
  };

  const handleHistory = (html: string) => {
    let lastContent = content.value;
    if (html !== lastContent) {
      setContent(html);
      push(html);
      lastContent = html;
    }
  };

  const ctx: EditorContext = {
    content,
    isEmpty,
    setContent,
    handleHistory,
    undo: () => {
      const prev = undo();
      if (prev !== null) {
        setContent(prev);
        return prev; // ✅ 返回给外部
      }
      return null;
    },
    redo: () => {
      const next = redo();
      if (next !== null) {
        setContent(next);
        return next;
      }
      return null;
    },
  };

  provide(EditorContextSymbol, ctx);
  return ctx;
}

export function useEditorContext(): EditorContext {
  const ctx = inject<EditorContext>(EditorContextSymbol);
  if (!ctx) {
    throw new Error("useEditorContext 必须在 provideEditorContext 之后使用。");
  }
  return ctx;
}
