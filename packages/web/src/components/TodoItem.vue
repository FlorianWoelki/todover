<template>
  <div
    class="relative flex items-start justify-between px-2 mx-4 bg-white border-b border-gray-200 border-dashed rounded hover:bg-gray-100 focus-within:bg-gray-100"
    :class="{ [staticItemClass]: noDblClick, [dragClasses]: true }"
    :draggable="!noDblClick"
    @click="noDblClick ? focusInputField() : handleOnClick($event)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @mouseenter="disabled ? setHovered(true) : () => {}"
    @mouseleave="disabled ? setHovered(false) : () => {}"
  >
    <div class="flex items-center flex-grow space-x-1">
      <div v-if="priority !== 'normal'" :class="{ 'text-gray-300': done }">
        <arrow-up-icon v-if="priority === 'high'" class="w-3 h-3"></arrow-up-icon>
        <arrow-down-icon v-else-if="priority === 'low'" class="w-3 h-3"></arrow-down-icon>
      </div>

      <title-input
        ref="inputField"
        class="text-sm xl:text-base"
        :class="{
          'cursor-pointer': disabled,
          'cursor-text': !disabled || noDblClick,
          'line-through text-gray-300': done,
        }"
        @keydown.enter="blurInputField"
        @blur="blurInputField"
        :input-disabled="disabled"
        :hovered="isHovered && !noDblClick"
        v-bind="$attrs"
      ></title-input>
    </div>

    <div v-if="loading" class="relative w-full">
      <div class="absolute inset-0 mt-2 ml-4">
        <svg
          class="w-4 h-4 text-red-400 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>

    <todo-item-menu
      v-if="(isHovered && !noDblClick) || (isSmallDevice && !noDblClick)"
      @remove-todo-item="handleRemoveButtonClick"
      @open-menu="handleOpenMenuClick"
    ></todo-item-menu>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, ref } from '@vue/runtime-core';
import { staticItemClass, dragAndDropDataId } from '@/util/constants';
import { isSmallDevice } from '@/util/screen';
import { TodoPriority } from '../store/state';
import ArrowUpIcon from '../assets/icons/arrow-up.svg?component';
import ArrowDownIcon from '../assets/icons/arrow-down.svg?component';

export default defineComponent({
  components: {
    ArrowUpIcon,
    ArrowDownIcon,
  },
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
    priority: {
      type: String as PropType<TodoPriority>,
      default: 'normal',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const disabled = ref(true);
    const inputField = ref<any | null>(null);
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
        inputField.value!.inputField.focus();
      });
    };

    const blurInputField = (): void => {
      if (!inputField.value || disabled.value) {
        return;
      }

      if (inputField.value.inputField.value) {
        if (inputField.value.inputField.value.length > 0) {
          emit('updateItem', inputField.value.inputField.value);
        }
      } else {
        if (inputField.value.inputField.innerText.length > 0) {
          emit('updateItem', inputField.value.inputField.innerText);
        }
      }

      disabled.value = true;
      setHovered(false);
      nextTick(() => {
        inputField.value!.inputField.blur();
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
      isSmallDevice,
    };
  },
});
</script>
