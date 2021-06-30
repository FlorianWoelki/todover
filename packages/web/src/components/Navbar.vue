<template>
  <div class="flex items-center justify-between px-4 py-2 text-white bg-gray-700 mb-14">
    <div class="flex items-center sm:space-x-4">
      <Logo class="hidden w-28 sm:block" />

      <div class="relative">
        <searchbar
          v-if="loggedIn && user"
          v-model="searchbar.input"
          class="z-20 md:block"
          @focus="focusSearchInput"
        />

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
            <p v-if="searchbar.results.length === 0" class="px-4 py-2 text-gray-400">No results</p>
            <div v-else class="space-y-1">
              <search-result
                v-for="(searchResult, index) in searchbar.results"
                :key="index"
                :name="searchResult.name"
                :description="searchResult.description"
                :repeated="searchResult.repetition"
                @click="setSelectedTodoItem(searchResult)"
              />
            </div>
          </div>
        </transition>
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
      <p class="z-50 hidden md:block">{{ user.me.email }}</p>
      <menu-icon class="z-50 w-6 h-6 md:hidden"></menu-icon>

      <dropdown
        #="{ itemClasses }"
        :dropdownHidden="dropdownHidden"
        @close.stop="dropdownHidden = true"
      >
        <p :class="itemClasses" @click="handleLogout">{{ $t('navbar.logoutButton') }}</p>
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
import Logo from '@/assets/logo.svg';
import { Todo } from '../store/state';
import MenuIcon from '../assets/icons/menu-alt3.svg';

interface ISearchbar {
  focused: boolean;
  results: Todo[];
  input: string;
}

export default defineComponent({
  components: {
    Logo,
    SearchResult,
    MenuIcon,
  },
  setup() {
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
        searchbar.results = [...filteredByName, ...filteredByDescription];
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
