<template>
  <navbar v-if="$route.path === '/'" class="font-sans antialiased" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, provide } from '@vue/runtime-core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apollo-client';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    provide(DefaultApolloClient, apolloClient(store));

    onMounted(async () => {
      const response = await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      }).then((res) => res.json());
      console.log(response);
    });
  },
});
</script>
