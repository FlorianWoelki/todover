<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center space-x-4">
      <Logo class="w-28" />
      <!-- hide for smaller screens until searchbar is implemented -->
      <div class="relative">
        <searchbar
          class="hidden md:block"
          @focus="searchbarFocused = true"
          @blur="searchbarFocused = false"
        />

        <div
          v-if="searchbarFocused"
          class="absolute top-0 left-0 z-50 p-2 mt-10 space-y-1 bg-white rounded-md shadow-md w-80"
        >
          <!-- <p class="text-gray-400">No results</p> -->
          <div
            class="px-4 py-2 transition duration-100 ease-in-out rounded-md cursor-pointer hover:bg-gray-100"
          >
            <p class="flex items-center space-x-2 text-gray-900">
              <span>Hello World</span>
              <refresh-icon class="w-4 h-4 text-gray-400"></refresh-icon>
            </p>
            <p class="text-sm text-gray-600">Description: "Test something"</p>
          </div>
          <div
            class="px-4 py-2 transition duration-100 ease-in-out rounded-md cursor-pointer hover:bg-gray-100"
          >
            <p class="text-gray-900">Hello World</p>
            <p class="text-sm text-gray-600">Description: "Test something"</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loggedIn || !user" class="flex items-center space-x-4">
      <router-link to="/register" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">
        {{ $t('navbar.registerButton') }}
      </router-link>
      <router-link to="/login" class="px-4 py-2 bg-transparent rounded hover:bg-gray-800">
        {{ $t('navbar.loginButton') }}
      </router-link>
    </div>
    <div
      v-else
      class="relative px-4 py-2 text-sm transition duration-100 ease-in-out bg-transparent rounded cursor-pointer hover:bg-gray-800"
      :class="{ 'bg-gray-800': !dropdownHidden }"
      @click="dropdownHidden = !dropdownHidden"
    >
      <p class="z-50">{{ user.me.email }}</p>

      <dropdown
        #="{ itemClasses }"
        :dropdownHidden="dropdownHidden"
        @close.stop="dropdownHidden = true"
      >
        <p :class="itemClasses" @click="handleLogout">{{ $t('navbar.logoutButton') }}</p>
      </dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import { defineComponent, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { getAccessToken, setAccessToken } from '../accessToken';
import mutations from '@/graphql/mutations';
import { Mutation, State } from '../store';
import queries from '../graphql/queries';
import Logo from '@/assets/logo.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';

export default defineComponent({
  components: {
    Logo,
    RefreshIcon,
  },
  setup() {
    const store = useStore<State>();
    const loggedIn = ref<boolean>(getAccessToken() !== '');
    const searchbarFocused = ref<boolean>(true);

    const dropdownHidden = ref<boolean>(true);

    const { mutate: logout } = useMutation(mutations.logout);

    const handleLogout = (): void => {
      logout().then(() => {
        store.commit(Mutation.SET_ME, undefined);
        store.commit(Mutation.SET_LISTS, []);
        store.commit(Mutation.SET_TODOS, []);
        setAccessToken('');
        loggedIn.value = false;
      });
    };

    const { result } = useQuery(queries.me);

    const user = useResult(result, null, (data) => {
      store.commit(Mutation.SET_ME, { value: data.me });
      return data;
    });

    return {
      searchbarFocused,
      user,
      handleLogout,
      loggedIn,
      dropdownHidden,
    };
  },
});
</script>
