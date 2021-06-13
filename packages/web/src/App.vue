<template>
  <navbar v-if="$route.path === '/'" class="font-sans antialiased" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from '@vue/runtime-core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apollo-client';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    provide(DefaultApolloClient, apolloClient(store));
  },
});
</script>
