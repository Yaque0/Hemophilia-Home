// types.ts

export type EditorCommand =
  | "bold"
  | "italic"
  | "insertImage"
  | "undo"
  | "redo"
  | "strikeThrough" // 增加新的命令：删除线
  | "alignLeft" // 增加对齐命令
  | "alignCenter"
  | "alignRight"
  | string; // 支持自定义命令

export interface ToolbarItem {
  type: "button" | "dropdown";
  label: string;
  command: EditorCommand;
  icon?: string;
  disabled?: boolean; // 可选：禁用该工具栏项
  children?: ToolbarItem[]; // 如果是下拉框，包含下拉框中的项
}

export interface EditorPlugin {
  install: (el: HTMLElement) => void;
  uninstall?: () => void;
  priority?: number; // 支持插件的优先级
}

export interface SanitizeConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOWED_URI_REGEXP?: RegExp;
}

export interface SelectionState {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}
