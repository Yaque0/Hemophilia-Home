// useHistoryManager.ts
import { ref, computed } from "vue";
import { getSelectionInfo, restoreSelection } from "@/utils/domUtils";
export function useHistoryManager(maxSteps = 100) {
  const stack = ref<string[]>([]);
  const index = ref(-1);

  const canUndo = computed(() => index.value > 0);
  const canRedo = computed(() => index.value < stack.value.length - 1);

  const push = (state: string) => {
    stack.value = stack.value.slice(0, index.value + 1); // 移除未来状态
    stack.value.push(state);
    if (stack.value.length > maxSteps) {
      stack.value.shift(); // 移除最旧记录
    } else {
      index.value = stack.value.length - 1;
    }
  };

  const undo = (): string | null => {
    // console.log(" current index:", index.value);
    if (canUndo.value) {
      index.value--;
      console.log("Undo 成功，栈:", stack.value[index.value]);
      console.log("index:", index.value);
      console.log("stack:", stack.value);
      return stack.value[index.value];
    }
    console.log("index:", canUndo.value, index.value);
    console.log("Cannot undo");
    return null;
  };

  const redo = (): string | null => {
    // console.log("current index:", index.value);
    if (canRedo.value) {
      index.value++;
      console.log("Redo成功，栈：", stack.value[index.value]);
      return stack.value[index.value];
    }
    console.log("Cannot redo");
    return null;
  };

  const clear = () => {
    stack.value = [];
    index.value = -1;
  };

  return {
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    clear,
  };
}
