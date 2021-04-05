<template>
  <div
    class="space-y-8 border-l border-r border-gray-100"
    :class="
      isCustomTitle
        ? 'text-gray-600'
        : {
            'text-gray-300': isPreviousDay,
            'text-red-500': isActiveItem,
            'text-gray-600': !isActiveItem && !isPreviousDay,
          }
    "
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold tracking-wider uppercase">
        {{ !isCustomTitle ? currentDay : customTitle }}
      </h1>
      <p v-if="isCustomTitle" class="text-sm">{{ printedDate }}</p>
    </div>

    <div class="w-full space-y-2">
      <draggable v-bind="$attrs" :animation="150" :move="checkMove" group="todos" class="space-y-2">
        <slot name="draggable"></slot>
      </draggable>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from '@vue/runtime-core';
import { VueDraggableNext } from 'vue-draggable-next';
import { dateKey, activeItemKey } from '@/symbols/day-grid';
import { days, months } from '@/constants/date';
import { mod } from '@/util/math';

export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    customTitle: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const draggableDisabled = ref(false);
    const currentDate = inject(dateKey);
    const activeItem = inject(activeItemKey, 1);
    const isCustomTitle = currentDate === undefined;

    const isActiveItem = computed((): boolean => activeItem === props.index);
    const isPreviousDay = computed((): boolean => activeItem - 1 === props.index);

    const getLastDateInMonth = (date: Date): Date =>
      new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const currentDay = computed((): string =>
      columnDate.value ? days[mod(columnDate.value.getDay() - 1, days.length)] : ''
    );

    const printedDate = computed((): string =>
      columnDate.value
        ? `${columnDate.value.getDate() - 1}.
        ${months[columnDate.value.getMonth()]}
        ${columnDate.value.getFullYear()}`
        : ''
    );

    const columnDate = computed((): Date | undefined => {
      if (currentDate) {
        const date = isPreviousDay.value
          ? currentDate.getDate()
          : currentDate.getDate() + props.index;

        if (date - 1 === 0) {
          return getLastDateInMonth(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
          );
        }

        if (date + 1 === getLastDateInMonth(currentDate).getDate()) {
          return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        }

        return new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
      }

      return undefined;
    });

    const checkMove = (): boolean => {
      const canMove = document.activeElement?.tagName === 'BODY';
      draggableDisabled.value = !canMove;
      return true;
    };

    return {
      currentDay,
      isActiveItem,
      isPreviousDay,
      printedDate,
      checkMove,
      draggableDisabled,
      isCustomTitle,
    };
  },
});
</script>
