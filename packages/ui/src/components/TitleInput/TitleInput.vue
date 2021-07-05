<template>
  <textarea
    v-if="hovered"
    ref="inputField"
    v-bind="$attrs"
    :value="modelValue"
    class="w-full px-0 py-1 overflow-hidden placeholder-gray-300 bg-transparent border-none resize-none select-none focus:outline-none focus:ring-0"
    @keydown.enter="blurInputField"
    @blur="blurInputField"
    @input="updateModelValue"
    wrap="hard"
    rows="1"
    :style="{ height: rowSizeOfInput }"
  />
  <input
    v-else
    ref="inputField"
    v-bind="$attrs"
    :value="modelValue"
    class="w-full px-0 py-1 overflow-hidden placeholder-gray-300 bg-transparent border-none select-none focus:outline-none overflow-ellipsis"
    @keydown.enter="blurInputField"
    @blur="blurInputField"
    @input="updateModelValue"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TitleInput',
  emits: ['blur', 'update:modelValue'],
  props: {
    hovered: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
    },
  },
  setup(props, { emit }) {
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

    const rowSizeOfInput = computed((): string => {
      if (inputField.value && props.hovered) {
        const height = inputField.value.scrollHeight;
        return `${height}px`;
      }
      return 'auto';
    });

    return {
      rowSizeOfInput,
      inputField,
      updateModelValue,
      blurInputField,
    };
  },
});
</script>
