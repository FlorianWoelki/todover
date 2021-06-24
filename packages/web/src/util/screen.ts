import { computed, onMounted, onUnmounted, ref } from '@vue/runtime-core';

let screenWidth = ref(screen.width);

const handleResize = () => {
  screenWidth.value = screen.width;
};

export const isSmallDevice = computed((): boolean => screenWidth.value < 1024);

export const setupEventListener = (): void => {
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
};
