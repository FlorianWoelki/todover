<template>
  <div
    v-if="hovered"
    ref="inputField"
    :contenteditable="!inputDisabled"
    v-bind="$attrs"
    class="w-full px-0 py-1 overflow-hidden placeholder-gray-300 bg-transparent border-none focus:outline-none overflow-ellipsis"
    @keydown.enter="blurInputField"
    @blur="blurInputField"
    @input="updateModelValue"
  >
    {{ $attrs.value }}
  </div>
  <input
    v-else
    ref="inputField"
    v-bind="$attrs"
    :value="modelValue"
    class="w-full px-0 py-1 overflow-hidden placeholder-gray-300 bg-transparent border-none focus:outline-none overflow-ellipsis"
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
    inputDisabled: {
      type: Boolean,
      default: false,
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
