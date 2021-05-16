<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <h1 class="text-xl font-bold">todover</h1>
    <div class="flex items-center space-x-4">
      <div class="relative mx-auto text-gray-600">
        <input
          type="text"
          class="h-10 px-3 pr-16 text-sm bg-white border-2 border-gray-300 rounded-lg transition duration-100 ease-in-out focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0"
          placeholder="Search ..."
        />
        <button type="submit" class="absolute top-0 right-0 mt-3 mr-4">
          <svg
            class="w-4 h-4 text-gray-400 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            style="enable-background: new 0 0 56.966 56.966"
            xml:space="preserve"
            width="512px"
            height="512px"
          >
            <path
              d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
            />
          </svg>
        </button>
      </div>
      <button type="button">Sign in</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({});
</script>
