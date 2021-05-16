<template>
  <input
    ref="inputField"
    v-bind="$attrs"
    :value="modelValue"
    class="w-full py-1 placeholder-gray-300 bg-transparent focus:outline-none"
    @keydown.enter="blurInputField"
    @input="updateModelValue"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TitleInput',
  emits: ['blur', 'update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
  },
  setup(_, { emit }) {
    const inputField = ref<null | HTMLInputElement>(null);

    const blurInputField = (): void => {
      if (!inputField.value) {
        return;
      }

      inputField.value.blur();
      emit('blur');
    };

    const updateModelValue = (e: InputEvent) => {
      emit('update:modelValue', (e.target as HTMLInputElement).value);
    };

    return {
      inputField,
      updateModelValue,
      blurInputField,
    };
  },
});
</script>
