<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center space-x-4">
      <h1 class="text-xl font-bold">todover</h1>
      <searchbar />
    </div>
    <div v-if="!loggedIn" class="flex items-center space-x-4">
      <router-link to="/register" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">
        Register
      </router-link>
      <router-link to="/login" class="px-4 py-2 bg-transparent rounded hover:bg-gray-800">
        Sign in
      </router-link>
    </div>
    <div
      v-else
      class="relative px-4 py-2 text-sm bg-transparent rounded cursor-default hover:bg-gray-800"
      :class="{ 'bg-gray-800': !dropdownHidden }"
      @mouseenter="dropdownHidden = false"
      @mouseleave="dropdownHidden = true"
    >
      <p>test@test.de</p>

      <div v-if="!dropdownHidden" class="absolute inset-x-0 top-0 p-4 mt-8 bg-gray-900 rounded-md">
        <p class="cursor-pointer" @click="handleLogout">Logout</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable';
import { computed, defineComponent, ref } from '@vue/runtime-core';
import gql from 'graphql-tag';

export default defineComponent({
  setup() {
    const loggedIn = computed(() => localStorage.getItem('token') !== '');

    const dropdownHidden = ref<boolean>(true);

    const { mutate: logout } = useMutation(gql`
      mutation logout {
        logout
      }
    `);

    const handleLogout = (): void => {
      logout();
      localStorage.setItem('token', '');
    };

    return {
      handleLogout,
      loggedIn,
      dropdownHidden,
    };
  },
});
</script>
