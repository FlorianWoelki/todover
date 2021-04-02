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
      <p>1st of April 2021</p>
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

    return {
      currentDay,
      isActiveItem,
      isPreviousDay,
    };
  },
});
</script>
