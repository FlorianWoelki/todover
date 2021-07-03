<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="!dropdownHidden"
      class="absolute inset-x-0 top-0 z-50 py-2 mt-10 rounded-md shadow-lg"
      v-bind="$attrs"
    >
      <slot :itemClasses="itemClasses"></slot>
    </div>
  </transition>

  <div
    v-if="!dropdownHidden"
    class="fixed inset-0 z-40 cursor-default"
    @click="emitCloseDropdownEvent"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false,
  name: 'Dropdown',
  emits: ['close'],
  props: {
    dropdownHidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const emitCloseDropdownEvent = (event: MouseEvent): void => {
      emit('close', event);
    };

    const itemClasses = computed(
      () => 'px-4 py-2 transition duration-100 ease-in-out cursor-pointer'
    );

    return {
      emitCloseDropdownEvent,
      itemClasses,
    };
  },
});
</script>
