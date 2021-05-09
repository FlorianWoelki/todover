<template>
  <div class="absolute inset-0 z-50 h-screen" @click="hideButton">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-xl p-4 bg-white rounded" @click.stop>
        <h1 class="text-xl">{{ todoItem.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core';
import { Todo } from '../store/state';

export default defineComponent({
  emits: ['hideButton'],
  props: {
    todoItem: {
      type: Object as PropType<Todo>,
      required: true,
    },
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
