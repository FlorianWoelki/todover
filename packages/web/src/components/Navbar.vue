<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center space-x-4">
      <h1 class="text-xl font-bold">todover</h1>
      <searchbar />
    </div>
    <div v-if="!loggedIn || !user" class="flex items-center space-x-4">
      <router-link to="/register" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">
        Register
      </router-link>
      <router-link to="/login" class="px-4 py-2 bg-transparent rounded hover:bg-gray-800">
        Sign in
      </router-link>
    </div>
    <div
      v-else
      class="relative px-4 py-2 text-sm transition duration-100 ease-in-out bg-transparent rounded cursor-pointer hover:bg-gray-800"
      :class="{ 'bg-gray-800': !dropdownHidden }"
    >
      <p class="z-50" @click="dropdownHidden = !dropdownHidden">{{ user.me.email }}</p>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="!dropdownHidden"
          class="absolute inset-x-0 top-0 z-50 p-4 mt-10 ml-auto bg-gray-800 rounded-md shadow-lg w-52"
        >
          <p class="cursor-pointer" @click="handleLogout">Logout</p>
        </div>
      </transition>

      <div
        v-if="!dropdownHidden"
        class="fixed inset-0 z-40 cursor-default"
        @click="dropdownHidden = true"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import { defineComponent, ref } from '@vue/runtime-core';
import gql from 'graphql-tag';
import { useStore } from 'vuex';
import { getAccessToken, setAccessToken } from '../accessToken';
import { Mutation, State } from '../store';

export default defineComponent({
  setup() {
    const store = useStore<State>();
    const loggedIn = ref<boolean>(getAccessToken() !== '');

    const dropdownHidden = ref<boolean>(true);

    const { mutate: logout } = useMutation(gql`
      mutation logout {
        logout
      }
    `);

    const handleLogout = (): void => {
      logout().then(() => {
        store.commit(Mutation.SET_ME, undefined);
        setAccessToken('');
        loggedIn.value = false;
      });
    };

    const { result } = useQuery(
      gql`
        query Me {
          me {
            email
          }
        }
      `
    );

    const user = useResult(result, null, (data) => {
      store.commit(Mutation.SET_ME, { value: data.me });
      return data;
    });

    return {
      user,
      handleLogout,
      loggedIn,
      dropdownHidden,
    };
  },
});
</script>
