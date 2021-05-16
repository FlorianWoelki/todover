<template>
  <input
    ref="inputField"
    v-bind="$attrs"
    class="w-full py-1 text-xl placeholder-gray-300 bg-transparent focus:outline-none"
    @keydown.enter="blurInputField"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TitleInput',
  emits: ['blur'],
  setup(_, { emit }) {
    const inputField = ref<null | HTMLInputElement>(null);

    const blurInputField = (): void => {
      if (!inputField.value) {
        return;
      }

      inputField.value.blur();
      emit('blur');
    };

    return {
      inputField,
      blurInputField,
    };
  },
});
</script>
