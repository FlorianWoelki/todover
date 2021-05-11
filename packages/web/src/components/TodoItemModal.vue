<template>
  <div class="absolute inset-0 z-50 h-screen" @click="hideButton">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-xl px-6 py-4 bg-white rounded" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl">{{ todoItem.name }}</h1>
          <button class="text-gray-500 hover:text-gray-600 focus:outline-none" @click="hideButton">
            <x-icon class="w-4 h-4"></x-icon>
          </button>
        </div>

        <label for="todo-description" class="text-sm text-gray-500">ToDo Description</label>
        <textarea
          id="todo-description"
          v-model="todoItem.description"
          class="w-full h-full px-3 py-2 mt-1 text-gray-500 placeholder-gray-300 bg-white border-gray-300 rounded appearance-none  focus:shadow-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          placeholder="Enter your todo description..."
          rows="5"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core';
import { Todo } from '../store/state';
import XIcon from '@/assets/icons/x.svg';

export default defineComponent({
  emits: ['hideButton'],
  components: {
    XIcon,
  },
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
