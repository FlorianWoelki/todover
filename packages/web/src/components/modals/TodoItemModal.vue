<template>
  <modal>
    <template #title>
      <title-input v-model="todoItem.name" class="text-xl"></title-input>
    </template>

    <div class="flex-col items-center mb-4">
      <label class="text-sm text-gray-400">ToDo Priority</label>
      <div class="flex items-center mt-1 space-x-6">
        <div class="flex items-center space-x-2">
          <input
            ref="highPriorityEl"
            type="checkbox"
            value="high"
            :checked="todoItem.priority === 'high'"
            @change="propagatePriorityChange('high')"
            class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
          />
          <label class="text-sm text-gray-500" @click="propagatePriorityChange('high', true)">
            High
          </label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            ref="lowPriorityEl"
            type="checkbox"
            value="low"
            :checked="todoItem.priority === 'low'"
            @change="propagatePriorityChange('low')"
            class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
          />
          <label class="text-sm text-gray-500" @click="propagatePriorityChange('low', true)">
            Low
          </label>
        </div>
      </div>
    </div>

    <div v-if="todoItem.date" class="flex-col items-center mb-4">
      <label class="text-sm text-gray-400">{{ $t('todoItemModal.repetition.label') }}</label>
      <div class="flex items-center mt-1 space-x-6">
        <div class="flex items-center space-x-2">
          <input
            ref="dailyRepetitionEl"
            type="checkbox"
            value="daily"
            :checked="todoItem.repetition === 'daily'"
            @change="propagateRepetitionChange('daily')"
            class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
          />
          <label class="text-sm text-gray-500" @click="propagateRepetitionChange('daily', true)">
            {{ $t('todoItemModal.repetition.daily') }}
          </label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            ref="weeklyRepetitionEl"
            type="checkbox"
            value="weekly"
            :checked="todoItem.repetition === 'weekly'"
            @change="propagateRepetitionChange('weekly')"
            class="text-red-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
          />
          <label class="text-sm text-gray-500" @click="propagateRepetitionChange('weekly', true)">
            {{ $t('todoItemModal.repetition.weekly') }}
          </label>
        </div>
      </div>
    </div>

    <label for="todo-description" class="text-sm text-gray-400">
      {{ $t('todoItemModal.description.label') }}
    </label>
    <textarea
      id="todo-description"
      v-model="todoItem.description"
      class="w-full h-full px-3 py-2 mt-1 text-gray-500 placeholder-gray-300 transition duration-100 ease-in-out bg-white border-gray-300 rounded appearance-none focus:shadow-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      :placeholder="$t('todoItemModal.description.placeholder')"
      rows="5"
    ></textarea>
  </modal>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/runtime-core';
import { Todo, TodoPriority, TodoRepetition } from '../../store/state';

export default defineComponent({
  props: {
    todoItem: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  setup(props) {
    const dailyRepetitionEl = ref<HTMLInputElement | null>(null);
    const weeklyRepetitionEl = ref<HTMLInputElement | null>(null);

    const highPriorityEl = ref<HTMLInputElement | null>(null);
    const lowPriorityEl = ref<HTMLInputElement | null>(null);

    const propagateRepetitionChange = (type: TodoRepetition, invert = false): void => {
      if (!dailyRepetitionEl.value || !weeklyRepetitionEl.value) {
        return;
      }

      if (type === 'weekly') {
        props.todoItem.repetition = weeklyRepetitionEl.value.checked !== invert ? 'weekly' : null;
      } else if (type === 'daily') {
        props.todoItem.repetition = dailyRepetitionEl.value.checked !== invert ? 'daily' : null;
      }
    };

    const propagatePriorityChange = (type: TodoPriority, invert = false): void => {
      if (!highPriorityEl.value || !lowPriorityEl.value) {
        return;
      }

      if (type === 'high') {
        props.todoItem.priority = highPriorityEl.value.checked !== invert ? 'high' : 'normal';
      } else if (type === 'low') {
        props.todoItem.priority = lowPriorityEl.value.checked !== invert ? 'low' : 'normal';
      }
    };

    return {
      weeklyRepetitionEl,
      dailyRepetitionEl,
      highPriorityEl,
      lowPriorityEl,
      propagateRepetitionChange,
      propagatePriorityChange,
    };
  },
});
</script>
