<template>
  <navbar class="font-sans antialiased" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from '@vue/runtime-core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apollo-client';

export default defineComponent({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
});
</script>
