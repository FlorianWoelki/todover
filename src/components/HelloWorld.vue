<template>
  <div class="px-8 prose">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { useStore, Mutation } from '@/store/index';
import { computed, defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: {
    msg: String,
  },
  setup() {
    const store = useStore();
    const appVersion = store.state.version; // not reactive!
    const count = computed(() => store.state.count);

    const increment = () => {
      store.commit(Mutation.INCREMENT, 1);
    };

    return {
      appVersion,
      count,
      increment,
    };
  },
});
</script>
