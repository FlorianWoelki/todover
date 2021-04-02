<template>
  <div class="space-y-8 border-l border-r border-gray-200">
    <div class="flex flex-col items-center justify-center text-gray-300">
      <h1 class="text-2xl font-bold tracking-wider uppercase">Thursday</h1>
      <p>1st of April 2021</p>
    </div>

    <div class="w-full space-y-2">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/runtime-core';
import { dateKey } from './DayGrid.vue';

export default defineComponent({
  setup() {
    const currentDate = inject(dateKey);
    console.log(currentDate);
  },
});
</script>
