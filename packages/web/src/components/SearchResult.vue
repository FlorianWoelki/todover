<template>
  <div
    class="transition duration-100 ease-in-out rounded-md cursor-pointer sm:px-4 sm:py-2 hover:bg-gray-100"
  >
    <p class="flex items-start space-x-2 text-gray-900">
      <span>{{ name }}</span>
      <refresh-icon v-if="repeated" class="w-4 h-4 mt-1 text-gray-400"></refresh-icon>
    </p>
    <p class="text-sm text-gray-600">
      {{ description ? `Description: "${description}"` : 'No description.' }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RefreshIcon from '@/assets/icons/refresh.svg?component';

export default defineComponent({
  components: {
    RefreshIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    repeated: {
      type: [Boolean, String],
      default: false,
    },
  },
});
</script>
