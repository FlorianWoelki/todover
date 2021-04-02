<template>
  <div class="space-y-8 border-l border-r border-gray-200">
    <div
      class="flex flex-col items-center justify-center"
      :class="{
        'text-gray-300': isPreviousDay,
        'text-red-400': isActiveItem,
      }"
    >
      <h1 class="text-2xl font-bold tracking-wider uppercase">{{ currentDay }}</h1>
      <p>{{ date }}</p>
    </div>

    <div class="w-full space-y-2">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@vue/runtime-core';
import { activeItemKey, dateKey } from './DayGrid.vue';

export default defineComponent({
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const currentDate = inject(dateKey, new Date());
    const activeItem = inject(activeItemKey, 1);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDay = computed(() => days[(currentDate.getDay() + props.index - 2) % days.length]);

    const isActiveItem = computed(() => activeItem === props.index);
    const isPreviousDay = computed(() => activeItem - 1 === props.index);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'Juli',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const date = computed(() => {
      const date = isPreviousDay.value
        ? currentDate.getDate()
        : currentDate.getDate() + props.index;
      // TODO: Check for next and previous month
      return `${date - 1}. ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    });

    return {
      currentDay,
      isActiveItem,
      isPreviousDay,
      date,
    };
  },
});
</script>
