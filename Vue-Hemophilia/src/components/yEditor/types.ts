// types.ts

export type EditorCommand =
  | "underline" // 增加下划线命令
  | "insertOrderedList" // 增加有序列表命令
  | "insertUnorderedList" // 增加无序列表命令
  | "bold" // 增加加粗命令
  | "italic" // 增加斜体命令
  | "insertImage" // 增加插入图片命令
  | "undo" // 增加撤销和重做命令
  | "redo" //  增加撤销和重做命令
  | "strikeThrough" // 增加新的命令：删除线
  | "justifyLeft" // 增加对齐命令
  | "justifyCenter"
  | "justify"
  | "justifyRight"
  | "justifyFull"
  | "fontSize" // 增加字体大小命令
  | "foreColor" // 增加字体颜色命令
  | "fontName" // 增加字体名称命令
  | string; // 支持自定义命令

export interface ToolbarItem {
  type: "button" | "dropdown";
  label: string;
  command?: EditorCommand;
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
