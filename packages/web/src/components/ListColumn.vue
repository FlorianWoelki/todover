<template>
  <div
    v-if="!hide"
    class="space-y-8 border-l border-r border-gray-100"
    :class="
      isCustomTitle
        ? 'text-gray-600'
        : {
            'text-gray-300': isOldDay,
            'text-red-500': isActiveItem,
            'text-gray-600': !isActiveItem && !isOldDay,
          }
    "
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold tracking-wider uppercase">
        {{ !isCustomTitle ? currentDay : customTitle }}
      </h1>
      <p v-if="!isCustomTitle" class="text-sm">{{ printedDate }}</p>
    </div>

    <div class="relative w-full space-y-2" style="height: calc(100% - 6rem)">
      <draggable
        v-bind="$attrs"
        :id="listColumnId"
        :animation="150"
        :filter="`.${[staticItemClass]}`"
        group="todos"
        class="h-full space-y-2"
      >
        <slot name="draggable"></slot>
        <slot :date="columnDate"></slot>
      </draggable>

      <div
        v-if="!isCustomTitle"
        class="absolute bottom-0 right-0 mr-8 font-bold tracking-tighter text-gray-100 text-7xl"
      >
        {{ printedDay }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@vue/runtime-core';
import { VueDraggableNext } from 'vue-draggable-next';
import { dateKey, activeItemKey } from '@/symbols/day-grid';
import { days, months } from '@/constants/date';
import { mod } from '@/util/math';
import { staticItemClass } from '@/util/constants';

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
    hide: {
      type: Boolean,
      default: false,
    },
    extraDayIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const currentDate = inject(dateKey);
    const activeItem = inject(activeItemKey, 1);
    const isCustomTitle = currentDate === undefined;

    const isActiveItem = computed((): boolean => activeItem - props.extraDayIndex === props.index);
    const isOldDay = computed((): boolean => activeItem - 1 - props.extraDayIndex >= props.index);

    const currentDay = computed((): string =>
      columnDate.value ? days[mod(columnDate.value.getDay(), days.length)] : ''
    );

    const printedDate = computed((): string =>
      columnDate.value
        ? `${printedDay.value}.
          ${months[columnDate.value.getMonth()]}
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
      return columnDate.value?.toDateString() ?? props.customTitle;
    });

    return {
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
