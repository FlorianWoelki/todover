<template>
  <div class="justify-center flex-1">
    <div class="container pt-8 mx-auto">
      <HelloWorld msg="Hello World" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  components: { HelloWorld },
});
</script>
