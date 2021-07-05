<template>
  <div class="z-50 flex items-center justify-between pl-2 space-x-2">
    <button
      type="button"
      class="text-gray-400 hover:text-gray-500 focus:outline-none"
      @click.stop="handleOpenMenuClick"
    >
      <dots-horizontal-icon class="w-4 h-4"></dots-horizontal-icon>
    </button>

    <button
      type="button"
      class="text-gray-400 hover:text-gray-500 focus:outline-none"
      @click.stop="handleRemoveButtonClick"
    >
      <x-icon class="w-4 h-4"></x-icon>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import XIcon from '@/assets/icons/x.svg';
import DotsHorizontalIcon from '@/assets/icons/dots-horizontal.svg';

export default defineComponent({
  emits: ['removeTodoItem', 'openMenu'],
  components: {
    XIcon,
    DotsHorizontalIcon,
  },
  setup(_, { emit }) {
    const handleRemoveButtonClick = () => {
      emit('removeTodoItem');
    };

    const handleOpenMenuClick = () => {
      emit('openMenu');
    };

    return {
      handleOpenMenuClick,
      handleRemoveButtonClick,
    };
  },
});
</script>
