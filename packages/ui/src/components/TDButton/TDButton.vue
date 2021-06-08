<template>
  <button
    type="button"
    class="rounded-lg w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition duration-100 ease-in-out"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  name: 'TdButton',
});
</script>
