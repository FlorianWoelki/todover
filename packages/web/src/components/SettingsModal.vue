<template>
  <div class="absolute inset-0 z-50 h-screen" @click="hideButton">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-xl px-6 py-4 bg-white rounded" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl">{{ $t('settings.title') }}</h2>
          <button class="text-gray-500 hover:text-gray-600 focus:outline-none" @click="hideButton">
            <x-icon class="w-4 h-4"></x-icon>
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <p>Language</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import XIcon from '@/assets/icons/x.svg';

export default defineComponent({
  emits: ['hideButton'],
  components: {
    XIcon,
  },
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
