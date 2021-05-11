<template>
  <div class="flex items-center justify-between space-x-2">
    <button
      type="button"
      class="text-gray-400 hover:text-gray-500 focus:outline-none"
      @click.stop="handleOpenMenuClick"
    >
      <dots-horizontal class="w-4 h-4"></dots-horizontal>
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
import DotsHorizontal from '@/assets/icons/dots-horizontal.svg';

export default defineComponent({
  emits: ['removeTodoItem', 'openMenu'],
  components: {
    XIcon,
    DotsHorizontal,
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
