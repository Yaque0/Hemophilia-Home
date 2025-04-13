/**
 * 编辑器命令类型
 * 用于定义编辑器支持的命令类型，如加粗、斜体、插入图片等。
 */
export type EditorCommand =
  | "bold" // 加粗命令
  | "italic" // 斜体命令
  | "insertImage" // 插入图片命令
  | "undo" // 撤销命令
  | "redo" // 重做命令
  | string; // 其他自定义命令

/**
 * 工具栏项接口
 * 用于定义工具栏中的每个项（按钮或下拉框），包括其类型、标签、命令等。
 */
export interface ToolbarItem {
  type: "button" | "dropdown"; // 工具栏项的类型，可能是按钮或下拉框
  label: string; // 工具栏项的标签（显示的文本）
  command: EditorCommand; // 对应的编辑器命令，决定点击该项后执行的操作
  icon?: string; // （可选）工具栏项的图标
  children?: ToolbarItem[]; // （可选）如果是下拉框，则包含下拉框中的项
}

/**
 * 编辑器插件接口
 * 用于定义一个编辑器插件，插件包含安装和卸载功能，可以对编辑器进行扩展。
 */
export interface EditorPlugin {
  install: (el: HTMLElement) => void; // 插件安装方法，接受一个 DOM 元素（通常是编辑器容器）作为参数
  uninstall?: () => void; // （可选）插件卸载方法
  priority?: number; // （可选）插件的优先级，数值越大表示优先级越高
}

/**
 * HTML 内容清理配置接口
 * 用于定义哪些标签、属性和协议是允许的，帮助清理不安全或不必要的内容。
 */
export interface SanitizeConfig {
  allowedTags?: string[];
  ALLOWED_TAGS?: string[];
  allowedAttributes?: Record<string, string[]>;
  ALLOWED_ATTR?: string[];
  allowedSchemes?: string[];
  ALLOWED_URI_REGEXP?: RegExp;
}

/**
 * 选区状态接口
 * 用于表示文本选区的起始和结束位置，适用于编辑器中的文本选择状态。
 */
export interface SelectionState {
  startPath: number[]; // 选区起始位置的路径（表示为 DOM 节点的路径）
  startOffset: number; // 选区起始位置的偏移量（文本的偏移量）
  endPath: number[]; // 选区结束位置的路径
  endOffset: number; // 选区结束位置的偏移量
}
