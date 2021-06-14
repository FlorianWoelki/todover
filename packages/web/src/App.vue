<template>
  <div v-if="loading" class="flex flex-col items-center justify-center w-full h-full space-y-4">
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
    <p class="text-sm font-bold text-red-900">Loading...</p>
  </div>
  <template v-else>
    <navbar v-if="$route.path === '/'" class="font-sans antialiased" />
    <router-view />
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref } from '@vue/runtime-core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { apolloClient } from './apollo-client';
import { Mutation } from './store';

export default defineComponent({
  setup() {
    const store = useStore();
    const loading = ref<boolean>(true);
    provide(DefaultApolloClient, apolloClient(store));

    onMounted(async () => {
      const token = store.state.user.accessToken;

      if (!token) {
        // TODO: change to env variable
        const { accessToken } = await fetch('http://localhost:4000/refresh_token', {
          method: 'POST',
          credentials: 'include',
        }).then((res) => res.json());

        store.commit(Mutation.SET_ACCESS_TOKEN, accessToken);
        loading.value = false;
      } else {
        try {
          const { exp } = jwtDecode<JwtPayload>(token);
          if (exp && Date.now() >= exp * 1000) {
            // TODO: change to env variable
            const { accessToken } = await fetch('http://localhost:4000/refresh_token', {
              method: 'POST',
              credentials: 'include',
            }).then((res) => res.json());

            store.commit(Mutation.SET_ACCESS_TOKEN, accessToken);
            loading.value = false;
          }
        } catch (error) {
          console.log('refresh token expired', error);
        }
      }
    });

    return {
      loading,
    };
  },
});
</script>
