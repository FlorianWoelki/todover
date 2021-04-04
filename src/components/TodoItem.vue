<template>
  <div @dblclick="disabled = false">
    <input
      v-bind="$attrs"
      class="w-full px-2 py-1 placeholder-gray-300 cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      :class="disabled ? 'cursor-pointer' : 'cursor-text'"
      @blur="disabled = true"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core';

export default defineComponent({
  setup() {
    const disabled = ref(true);
    return {
      disabled,
    };
  },
});
</script>
