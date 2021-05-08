<template>
  <div class="absolute inset-0 z-50 h-screen" @click="hideButton">
    <div class="flex items-center justify-center h-full">
      <div class="w-2/4 bg-white rounded" @click.stop>
        <h1>test</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  emits: ['hideButton'],
  setup(_, { emit }) {
    const hideButton = (): void => {
      emit('hideButton');
    };

    return {
      hideButton,
    };
  },
});
</script>
