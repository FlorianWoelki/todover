<template>
  <div
    v-if="!hide"
    class="relative space-y-8 overflow-y-auto border-l border-r border-gray-100"
    :class="
      isCustomTitle
        ? 'text-gray-600'
        : {
            'text-gray-300': isOldDay,
            'text-red-500': isActiveItem,
            'text-gray-600': !isActiveItem && !isOldDay,
          }
    "
    @mouseenter="isCustomTitle ? setListMenuHidden(false) : () => {}"
    @mouseleave="isCustomTitle ? setListMenuHidden(true) : () => {}"
  >
    <div
      v-if="isCustomTitle"
      v-show="isCustomTitle && !isListMenuHidden"
      class="absolute top-0 left-0 right-0 px-2 mt-1"
    >
      <button
        type="button"
        class="text-gray-400 hover:text-gray-500 focus:outline-none"
        @click="handleRemoveButton"
      >
        <x-icon class="w-4 h-4"></x-icon>
      </button>
    </div>

    <div
      class="flex flex-col items-center justify-center"
      :style="isCustomTitle ? 'margin-top: 1.5rem' : ''"
    >
      <h1 v-if="!isCustomTitle" class="text-2xl font-bold tracking-wider uppercase">
        {{ currentDay }}
      </h1>
      <title-input
        v-else
        v-model="listTitle"
        class="text-2xl font-bold tracking-wider text-center uppercase"
        style="box-shadow: none"
      ></title-input>
      <p v-if="!isCustomTitle" class="text-sm">{{ printedDate }}</p>
    </div>

    <div class="relative w-full space-y-2" style="height: calc(100% - 6rem)">
      <div class="h-full space-y-2" @drop="handleDrop($event)" @dragenter.prevent @dragover.prevent>
        <slot name="draggable"></slot>
        <slot :date="columnDate"></slot>
      </div>

      <div
        v-if="!isCustomTitle"
        class="absolute bottom-0 right-0 mr-8 font-bold tracking-tighter text-gray-100 pointer-events-none text-7xl"
      >
        {{ printedDay }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { dateKey, activeItemKey } from '@/symbols/day-grid';
import { mod } from '@/util/math';
import { staticItemClass, days, dragAndDropDataId, months } from '@/util/constants';
import { List, Todo } from '../store/state';
import XIcon from '@/assets/icons/x.svg?component';

export default defineComponent({
  emits: ['end', 'update-list-title', 'removeList'],
  components: {
    XIcon,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    extraDayIndex: {
      type: Number,
      default: 0,
    },
    listId: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const currentDate = inject(dateKey);
    const activeItem = inject(activeItemKey, 1);
    const isCustomTitle = currentDate === undefined;

    const isListMenuHidden = ref(true);

    const isActiveItem = computed((): boolean => activeItem - props.extraDayIndex === props.index);
    const isOldDay = computed((): boolean => activeItem - 1 - props.extraDayIndex >= props.index);

    const currentDay = computed((): string =>
      columnDate.value ? days()[mod(columnDate.value.getDay(), days().length)] : ''
    );

    const printedDate = computed((): string =>
      columnDate.value
        ? `${printedDay.value}.
          ${months()[columnDate.value.getMonth()]}
          ${columnDate.value.getFullYear()}`
        : ''
    );

    const printedDay = computed((): string => {
      if (columnDate.value) {
        const day = columnDate.value.getDate();
        return day < 10 ? `0${day}` : `${day}`;
      }
      return '';
    });

    const columnDate = computed((): Date | undefined => {
      if (currentDate) {
        const date = currentDate.getDate() + props.index + props.extraDayIndex;

        return new Date(currentDate.getFullYear(), currentDate.getMonth(), date - 1);
      }

      return undefined;
    });

    const listColumnId = computed((): string => {
      return columnDate.value?.toDateString() ?? props.listId ?? '';
    });

    const listTitle = computed({
      get() {
        const filteredLists: List[] = store.state.lists.filter(
          (list: List) => list.id === props.listId
        );
        return filteredLists[0]?.name ?? '';
      },
      set(newValue) {
        emit('update-list-title', newValue);
      },
    });

    const handleDrop = (event: DragEvent): void => {
      if (!event.dataTransfer) {
        return;
      }

      setListMenuHidden(true);
      const todoId = event.dataTransfer.getData(dragAndDropDataId);
      const todoItem: Todo = store.state.todos.filter((todo: Todo) => todo.id === todoId)[0];
      if (todoItem) {
        emit('end', { todoItem, newListId: listColumnId.value });
      }
    };

    const setListMenuHidden = (isHidden: boolean): void => {
      isListMenuHidden.value = isHidden;
    };

    const handleRemoveButton = (): void => {
      emit('removeList');
    };

    return {
      handleRemoveButton,
      setListMenuHidden,
      isListMenuHidden,
      listTitle,
      handleDrop,
      listColumnId,
      currentDay,
      isActiveItem,
      isOldDay,
      printedDate,
      isCustomTitle,
      staticItemClass,
      printedDay,
      columnDate,
    };
  },
});
</script>
