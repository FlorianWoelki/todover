<template>
  <div
    v-if="$store.state.loading"
    class="flex flex-col items-center justify-center w-full h-full space-y-4"
  >
    <svg
      class="w-16 h-16 text-red-600 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p class="text-sm text-gray-900">Loading...</p>
  </div>
  <template v-else>
    <navbar v-if="includeNavbarRoutes.includes($route.path)" class="font-sans antialiased" />
    <router-view />
  </template>

  <cookie-consent></cookie-consent>
</template>

<script lang="ts">
import { defineComponent, provide } from '@vue/runtime-core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apollo-client';
import CookieConsent from './components/CookieConsent.vue';

export default defineComponent({
  components: { CookieConsent },
  setup() {
    provide(DefaultApolloClient, apolloClient);

    const includeNavbarRoutes = ['/', '/imprint', '/dataprivacy'];

    return {
      includeNavbarRoutes,
    };
  },
});
</script>
