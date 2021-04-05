<template>
  <div @dblclick="focusInputField">
    <input
      v-bind="$attrs"
      ref="inputField"
      class="w-full px-2 py-1 placeholder-gray-300 bg-white cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      :class="disabled ? 'cursor-pointer' : 'cursor-text'"
      @keydown.enter="blurInputField"
      @blur="blurInputField"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from '@vue/runtime-core';

export default defineComponent({
  emits: ['updateItem'],
  setup(_, { emit }) {
    const disabled = ref(true);
    const inputField = ref<HTMLInputElement | null>(null);

    const focusInputField = (): void => {
      if (!inputField.value) {
        return;
      }

      disabled.value = false;
      nextTick(() => {
        inputField.value!.focus();
      });
    };

    const blurInputField = (): void => {
      if (!inputField.value) {
        return;
      }

      emit('updateItem', inputField.value.value);

      disabled.value = true;
      nextTick(() => {
        inputField.value!.blur();
      });
    };

    return {
      disabled,
      focusInputField,
      blurInputField,
      inputField,
    };
  },
});
</script>
