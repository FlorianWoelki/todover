<template>
  <div class="space-y-8 border-l border-r border-gray-100">
    <div
      class="flex flex-col items-center justify-center"
      :class="{
        'text-gray-300': isPreviousDay,
        'text-red-400': isActiveItem,
      }"
    >
      <h1 class="text-2xl font-bold tracking-wider uppercase">{{ currentDay }}</h1>
      <p>{{ printedDate }}</p>
    </div>

    <draggable v-bind="$attrs" class="w-full space-y-2" :animation="150" group="todos">
      <slot></slot>
    </draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@vue/runtime-core';
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
  },
  setup(props) {
    const currentDate = inject(dateKey, new Date());
    const activeItem = inject(activeItemKey, 1);

    const isActiveItem = computed((): boolean => activeItem === props.index);
    const isPreviousDay = computed((): boolean => activeItem - 1 === props.index);

    const getLastDateInMonth = (date: Date): Date =>
      new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const currentDay = computed(
      (): string => days[mod(columnDate.value.getDay() - 1, days.length)]
    );

    const printedDate = computed(
      (): string =>
        `${columnDate.value.getDate() - 1}.
        ${months[columnDate.value.getMonth()]}
        ${columnDate.value.getFullYear()}`
    );

    const columnDate = computed(
      (): Date => {
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
    );

    return {
      currentDay,
      isActiveItem,
      isPreviousDay,
      printedDate,
    };
  },
});
</script>
