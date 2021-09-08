<template>
  <button
    type="button"
    class="w-full px-4 py-2 text-white transition duration-100 ease-in-out bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-opacity-50 focus:outline-none"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
    }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
