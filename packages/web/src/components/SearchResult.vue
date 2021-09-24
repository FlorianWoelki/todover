<template>
  <div
    class="transition duration-100 ease-in-out rounded-md cursor-pointer sm:px-4 sm:py-2 hover:bg-gray-100"
  >
    <div class="flex items-center justify-between">
      <p class="flex items-start space-x-2 text-gray-900">
        <span :class="{ 'line-through text-gray-500': todo.done }">{{ todo.name }}</span>
        <refresh-icon v-if="todo.repetition" class="w-4 h-4 mt-1 text-gray-400"></refresh-icon>
      </p>
      <p v-if="todo.date" class="text-xs text-gray-500">
        {{ `${todo.date.getDate()}.${todo.date.getMonth()}.${todo.date.getYear()}` }}
      </p>
    </div>
    <p class="text-sm text-gray-600">
      {{ trimmedDescription ? `Description: "${trimmedDescription}..."` : 'No description.' }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import RefreshIcon from '@/assets/icons/refresh.svg?component';
import { Todo } from '../store/state';

export default defineComponent({
  components: {
    RefreshIcon,
  },
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  setup(props) {
    const trimmedDescription = computed((): string | undefined =>
      props.todo.description?.substring(0, 48)
    );

    return {
      trimmedDescription,
    };
  },
});
</script>
