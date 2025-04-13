import { ref, computed } from "vue";

export function useHistoryManager(maxSteps = 100) {
  const stack = ref<string[]>([]); // 历史记录栈
  const index = ref(-1); // 当前栈的指针，指向当前状态所在的位置

  const canUndo = computed(() => index.value > 0);
  const canRedo = computed(() => index.value < stack.value.length - 1);

  const push = (state: string) => {
    stack.value = stack.value.slice(0, index.value + 1);
    stack.value.push(state);
    index.value = Math.min(index.value + 1, maxSteps - 1);
  };

  // 撤销
  const undo = (): string | null => {
    if (canUndo.value) {
      index.value--;
      return stack.value[index.value];
    }
    return null;
  };

  // 重做
  const redo = (): string | null => {
    if (canRedo.value) {
      index.value++;
      return stack.value[index.value];
    }
    return null;
  };

  // 清空历史记录
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
