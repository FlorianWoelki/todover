<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center sm:space-x-4">
      <router-link to="/">
        <logo class="hidden w-28 sm:block" />
        <logo-small class="w-8 h-8 -ml-4 sm:hidden" />
      </router-link>

      <div class="relative">
        <searchbar
          v-if="loggedIn && user"
          v-model="searchbar.input"
          class="md:block"
          @focus="focusSearchInput"
        />
        <p v-else class="text-sm text-gray-300">{{ $t('preview') }}</p>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="searchbar.focused"
            class="absolute top-0 left-0 z-50 w-56 p-4 mt-10 space-y-1 bg-white rounded-md shadow-md md:w-80"
          >
            <p v-if="searchbar.results.length === 0" class="text-gray-400 sm:px-4 sm:py-2">
              {{ $t('navbar.search.noResults') }}
            </p>
            <div v-else class="space-y-4 sm:space-y-1">
              <search-result
                v-for="(searchResult, index) in searchbar.results"
                :key="index"
                :todo="searchResult"
                @click="setSelectedTodoItem(searchResult)"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- User is not loggedin: show dropdown menu with sign up button -->
    <div v-if="!loggedIn || !user" class="flex items-center space-x-4">
      <router-link to="/register" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">
        {{ $t('navbar.registerButton') }}
      </router-link>
      <div
        class="relative px-4 py-2 text-sm transition duration-100 ease-in-out bg-transparent rounded cursor-pointer hover:bg-gray-800"
        :class="{ 'bg-gray-800': !dropdownHidden }"
        @click="dropdownHidden = !dropdownHidden"
      >
        <p class="z-50 cursor-pointer">preview@todover.com</p>
        <dropdown
          #="{ itemClasses }"
          class="ml-auto bg-gray-800 w-52"
          :dropdownHidden="dropdownHidden"
          @close.stop="dropdownHidden = true"
        >
          <router-link
            to="/login"
            class="flex items-center space-x-2 hover:bg-gray-900"
            :class="itemClasses"
          >
            <login-icon class="w-4 h-4"></login-icon>
            <span>{{ $t('navbar.loginButton') }}</span>
          </router-link>

          <dropdown-border></dropdown-border>

          <router-link
            to="/imprint"
            class="flex items-center space-x-2 text-gray-300 hover:bg-gray-900"
            :class="itemClasses"
          >
            <printer-icon class="w-4 h-4"></printer-icon>
            <span>{{ $t('navbar.imprintButton') }}</span>
          </router-link>
          <router-link
            to="/dataprivacy"
            class="flex items-center space-x-2 text-gray-300 hover:bg-gray-900"
            :class="itemClasses"
          >
            <database-icon class="w-4 h-4"></database-icon>
            <span>{{ $t('navbar.privacyButton') }}</span>
          </router-link>
        </dropdown>
      </div>
    </div>

    <!-- User is logged in: only show dropdown menu -->
    <div
      v-else
      class="relative px-4 py-2 text-sm transition duration-100 ease-in-out bg-transparent rounded cursor-pointer hover:bg-gray-800"
      :class="{ 'bg-gray-800': !dropdownHidden }"
      @click="dropdownHidden = !dropdownHidden"
    >
      <p class="z-50 hidden md:block">{{ user.me.email }}</p>
      <menu-icon class="z-50 w-6 h-6 md:hidden"></menu-icon>

      <dropdown
        #="{ itemClasses }"
        class="ml-auto bg-gray-800 w-52"
        :dropdownHidden="dropdownHidden"
        @close.stop="dropdownHidden = true"
      >
        <p
          class="flex items-center space-x-2 hover:bg-gray-900"
          :class="itemClasses"
          @click="handleLogout"
        >
          <logout-icon class="w-4 h-4"></logout-icon>
          <span>{{ $t('navbar.logoutButton') }}</span>
        </p>

        <dropdown-border></dropdown-border>

        <router-link
          to="/imprint"
          class="flex items-center space-x-2 text-gray-300 hover:bg-gray-900"
          :class="itemClasses"
        >
          <printer-icon class="w-4 h-4"></printer-icon>
          <span>{{ $t('navbar.imprintButton') }}</span>
        </router-link>
        <router-link
          to="/dataprivacy"
          class="flex items-center space-x-2 text-gray-300 hover:bg-gray-900"
          :class="itemClasses"
        >
          <database-icon class="w-4 h-4"></database-icon>
          <span>{{ $t('navbar.privacyButton') }}</span>
        </router-link>
      </dropdown>
    </div>

    <!-- Div element that will be there for the blur event of the searchbar because the click on a search result triggers the blur event -->
    <div
      v-if="searchbar.focused"
      tabindex="-1"
      class="fixed inset-0 z-10"
      @click="searchbar.focused = false"
    ></div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import { defineComponent, reactive, ref, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { getAccessToken, setAccessToken } from '../accessToken';
import mutations from '@/graphql/mutations';
import { Mutation, State } from '../store';
import queries from '../graphql/queries';
import SearchResult from '@/components/SearchResult.vue';
import Logo from '@/assets/logo.svg?component';
import LogoSmall from '@/assets/logo-small.svg?component';
import { Todo } from '../store/state';
import DatabaseIcon from '../assets/icons/database.svg?component';
import PrinterIcon from '../assets/icons/printer.svg?component';
import LogoutIcon from '../assets/icons/logout.svg?component';
import LoginIcon from '../assets/icons/login.svg?component';
import MenuIcon from '../assets/icons/menu-alt3.svg?component';
import { useI18n } from 'vue-i18n';

interface ISearchbar {
  focused: boolean;
  results: Todo[];
  input: string;
}

export default defineComponent({
  components: {
    Logo,
    LogoSmall,
    SearchResult,
    MenuIcon,
    DatabaseIcon,
    PrinterIcon,
    LogoutIcon,
    LoginIcon,
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    const store = useStore<State>();
    const loggedIn = ref<boolean>(getAccessToken() !== '');
    const searchbar = reactive<ISearchbar>({
      focused: false,
      results: [],
      input: '',
    });

    const dropdownHidden = ref<boolean>(true);

    const { mutate: logout } = useMutation(mutations.logout);

    const handleLogout = (): void => {
      logout().then(() => {
        store.commit(Mutation.SET_ME, undefined);
        store.commit(Mutation.UPDATE_SETTINGS, undefined);
        store.commit(Mutation.SET_LISTS, []);
        store.commit(Mutation.SET_TODOS, []);
        setAccessToken('');
        loggedIn.value = false;
      });
    };

    const { result } = useQuery(queries.me);

    const user = useResult(result, null, (data) => {
      if (data.me.settings) {
        locale.value = data.me.settings.language;
      }
      return data;
    });

    watch(
      () => searchbar.input,
      () => checkSearchResults()
    );

    const checkSearchResults = (): void => {
      if (searchbar.input.length === 0) {
        searchbar.results = [];
      } else {
        const todos = store.state.todos;
        const filteredByName = todos.filter((todo) =>
          todo.name.toLowerCase().includes(searchbar.input.toLowerCase())
        );
        const filteredByDescription = todos.filter((todo) =>
          todo.description?.toLowerCase().includes(searchbar.input.toLowerCase())
        );

        const results = [...filteredByName, ...filteredByDescription].sort(
          (a, b) => Number(a.done) - Number(b.done)
        );
        searchbar.results = results;
      }
    };

    const setSelectedTodoItem = (todo: Todo): void => {
      searchbar.focused = false;
      store.commit(Mutation.SET_SELECTED_TODO_ITEM, todo);
    };

    const focusSearchInput = (): void => {
      searchbar.focused = true;
      checkSearchResults();
    };

    return {
      focusSearchInput,
      setSelectedTodoItem,
      handleLogout,
      searchbar,
      user,
      loggedIn,
      dropdownHidden,
    };
  },
});
</script>
