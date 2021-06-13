<template>
  <div v-if="loading">loading...</div>
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
