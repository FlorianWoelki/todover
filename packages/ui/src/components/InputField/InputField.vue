<template>
  <div class="flex flex-col space-y-1 w-full">
    <label v-if="label" for="email" class="font-semibold text-sm text-gray-500">{{ label }}</label>
    <input
      v-bind="$attrs"
      class="py-2 px-3 bg-white border border-gray-300 shadow-sm rounded-lg transition duration-100 ease-in-out focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false,
  name: 'InputField',
  props: {
    label: {
      type: String,
    },
  },
});
</script>
