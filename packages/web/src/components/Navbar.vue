<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center space-x-4">
      <h1 class="text-xl font-bold">todover</h1>
      <searchbar />
    </div>
    <div class="flex items-center space-x-4">
      <button type="button" class="rounded px-4 py-2 bg-gray-500 hover:bg-gray-600">
        Register
      </button>
      <button type="button" class="rounded px-4 py-2 bg-transparent hover:bg-gray-800">
        Sign in
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({});
</script>
