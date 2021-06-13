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
import { apolloClient } from './apollo-client';
import { useStore } from 'vuex';
import { Mutation } from './store';

export default defineComponent({
  setup() {
    const store = useStore();
    const loading = ref<boolean>(true);
    provide(DefaultApolloClient, apolloClient(store));

    onMounted(async () => {
      // TODO: change to env variable
      const { accessToken } = await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      }).then((res) => res.json());

      store.commit(Mutation.SET_ACCESS_TOKEN, accessToken);
      loading.value = false;
    });

    return {
      loading,
    };
  },
});
</script>
