<template>
  <button
    type="button"
    class="rounded-lg w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition duration-100 ease-in-out disabled:bg-opacity-50"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
    }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  name: 'TdButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
