<template>
  <div class="absolute inset-0 z-50 h-screen" @click="hideButton">
    <div class="flex items-center justify-center h-full">
      <div class="w-full max-w-xl px-6 py-4 bg-white rounded" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <input
            ref="nameInputField"
            class="w-full py-1 text-xl placeholder-gray-300 bg-transparent focus:outline-none"
            v-model="todoItem.name"
            @keydown.enter="blurInputField"
          />
          <button class="text-gray-500 hover:text-gray-600 focus:outline-none" @click="hideButton">
            <x-icon class="w-4 h-4"></x-icon>
          </button>
        </div>

        <div v-if="todoItem.date" class="flex-col items-center mb-4">
          <label class="text-sm text-gray-400">ToDo Repeat?</label>
          <div class="flex items-center space-x-6">
            <div class="space-x-2">
              <input
                type="checkbox"
                value="daily"
                :checked="todoItem.repetition === 'daily'"
                @change="handleCheckboxChange($event, 'daily')"
                class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm  focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
              />
              <label class="text-sm text-gray-500">Daily</label>
            </div>
            <div class="space-x-2">
              <input
                type="checkbox"
                value="weekly"
                :checked="todoItem.repetition === 'weekly'"
                @change="handleCheckboxChange($event, 'weekly')"
                class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm  focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
              />
              <label class="text-sm text-gray-500">Weekly</label>
            </div>
          </div>
        </div>

        <label for="todo-description" class="text-sm text-gray-400">ToDo Description</label>
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
import { defineComponent, PropType, ref } from '@vue/runtime-core';
import { Todo, TodoRepetition } from '../store/state';
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
  setup(props, { emit }) {
    const nameInputField = ref<null | HTMLInputElement>(null);

    const hideButton = (): void => {
      emit('hideButton');
    };

    const blurInputField = () => {
      if (!nameInputField.value) {
        return;
      }

      nameInputField.value.blur();
    };

    const handleCheckboxChange = (event: InputEvent, type: TodoRepetition) => {
      const target = event.target as HTMLInputElement;
      if (type === 'weekly') {
        props.todoItem.repetition = target.checked ? 'weekly' : undefined;
      } else if (type === 'daily') {
        props.todoItem.repetition = target.checked ? 'daily' : undefined;
      }
    };

    return {
      handleCheckboxChange,
      nameInputField,
      blurInputField,
      hideButton,
    };
  },
});
</script>
