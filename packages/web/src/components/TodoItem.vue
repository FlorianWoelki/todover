<template>
  <div
    class="flex items-center justify-between px-2 mx-4 bg-white border-b border-gray-200 border-dashed rounded cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
    :class="{ [staticItemClass]: noDblClick }"
    :draggable="!noDblClick"
    @click="noDblClick ? focusInputField() : handleOnClick($event)"
    @dragstart="handleDrag"
  >
    <input
      v-bind="$attrs"
      ref="inputField"
      class="w-full py-1 placeholder-gray-300 bg-transparent focus:outline-none"
      :class="{
        'cursor-pointer': disabled,
        'cursor-text': !disabled || noDblClick,
        'line-through text-gray-300': done,
      }"
      @keydown.enter="blurInputField"
      @blur="blurInputField"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from '@vue/runtime-core';
import { staticItemClass, dragAndDropDataId } from '@/util/constants';

export default defineComponent({
  emits: ['updateItem', 'click'],
  props: {
    todoId: {
      type: String,
      required: false,
    },
    noDblClick: {
      type: Boolean,
      default: false,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const disabled = ref(true);
    const inputField = ref<HTMLInputElement | null>(null);
    const timeoutId = ref<null | NodeJS.Timeout>(null);
    const clicks = ref(0);

    const focusInputField = (): void => {
      if (!inputField.value) {
        return;
      }

      disabled.value = false;
      nextTick(() => {
        inputField.value!.focus();
      });
    };

    const blurInputField = (): void => {
      if (!inputField.value || disabled.value) {
        return;
      }

      if (inputField.value.value.length > 0) {
        emit('updateItem', inputField.value.value);
      }

      disabled.value = true;
      nextTick(() => {
        inputField.value!.blur();
      });
    };

    const handleOnClick = (e: MouseEvent): void => {
      e.preventDefault();

      if (!disabled.value) {
        return;
      }

      clicks.value += 1;
      if (clicks.value === 1) {
        timeoutId.value = setTimeout(() => {
          emit('click');
          clicks.value = 0;
        }, 200);
      } else if (clicks.value === 2) {
        if (timeoutId.value) clearTimeout(timeoutId.value);
        clicks.value = 0;
        focusInputField();
      }
    };

    const handleDrag = (event: DragEvent): void => {
      if (!event.dataTransfer || !props.todoId) {
        return;
      }

      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData(dragAndDropDataId, props.todoId);
    };

    return {
      handleDrag,
      handleOnClick,
      disabled,
      focusInputField,
      blurInputField,
      inputField,
      staticItemClass,
    };
  },
});
</script>
