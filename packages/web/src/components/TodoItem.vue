<template>
  <div
    class="flex items-center justify-between px-2 mx-4 bg-white border-b border-gray-200 border-dashed rounded cursor-pointer  hover:bg-gray-100 focus-within:bg-gray-100"
    :class="{ [staticItemClass]: noDblClick, [dragClasses]: true }"
    :draggable="!noDblClick"
    @click="noDblClick ? focusInputField() : handleOnClick($event)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @mouseenter="disabled ? setHovered(true) : () => {}"
    @mouseleave="disabled ? setHovered(false) : () => {}"
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

    <todo-item-menu
      v-if="isHovered && !noDblClick"
      @remove-todo-item="handleRemoveButtonClick"
      @open-menu="handleOpenMenuClick"
    ></todo-item-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from '@vue/runtime-core';
import { staticItemClass, dragAndDropDataId } from '@/util/constants';

export default defineComponent({
  emits: ['updateItem', 'click', 'removeItem', 'openMenu'],
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
    const isHovered = ref(false);
    const dragClasses = ref('');

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
      setHovered(false);
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

    const handleDragStart = (event: DragEvent): void => {
      if (!event.dataTransfer || !props.todoId) {
        return;
      }

      dragClasses.value = 'opacity-40';

      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData(dragAndDropDataId, props.todoId);
    };

    const handleDragEnd = (): void => {
      dragClasses.value = 'opacity-100';
    };

    const setHovered = (hovered: boolean): void => {
      isHovered.value = hovered;
    };

    const handleRemoveButtonClick = (): void => {
      emit('removeItem');
    };

    const handleOpenMenuClick = (): void => {
      emit('openMenu');
    };

    return {
      handleOpenMenuClick,
      dragClasses,
      handleRemoveButtonClick,
      isHovered,
      setHovered,
      handleDragStart,
      handleDragEnd,
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
