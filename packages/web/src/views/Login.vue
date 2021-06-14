<template>
  <div class="flex flex-col items-center justify-center w-full h-screen -mt-12">
    <Logo class="w-48 mb-2" />
    <h1 class="mb-8 text-3xl font-bold tracking-wide text-center text-gray-700">
      Sign in to your account
    </h1>
    <router-link
      to="/register"
      class="mb-4 text-sm text-right text-gray-400 underline transition duration-100 ease-in-out hover:text-gray-500"
    >
      No account? No problem!
    </router-link>

    <div class="w-full max-w-lg px-10 py-8 space-y-6 bg-white rounded-lg shadow">
      <input-field
        v-model="email"
        label="Email address"
        type="email"
        @keydown.enter="handleSignIn"
      />
      <input-field
        v-model="password"
        label="Password"
        type="password"
        @keydown.enter="handleSignIn"
      />

      <td-button
        :disabled="loginButtonDisabled"
        @click="handleSignIn"
        class="flex items-center justify-center"
      >
        <svg
          v-if="loginLoading"
          class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Sign in
      </td-button>
    </div>
    <p v-if="showError" class="mt-4 text-red-500">Wrong email address or password</p>
  </div>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { computed, defineComponent, ref } from 'vue';
import Logo from '@/assets/logo.svg';
import { isEmailValid } from '../util/validation';
import { useStore } from 'vuex';
import { Mutation } from '../store';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref<string>('');
    const password = ref<string>('');
    const showError = ref<boolean>(false);
    const loginLoading = ref<boolean>(false);

    const { mutate: login } = useMutation(gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
        }
      }
    `);

    const loginButtonDisabled = computed((): boolean => {
      return (
        loginLoading.value ||
        email.value.length === 0 ||
        password.value.length === 0 ||
        !isEmailValid(email.value)
      );
    });

    const handleSignIn = (): void => {
      if (loginButtonDisabled.value) {
        return;
      }

      loginLoading.value = true;

      login({ email: email.value, password: password.value })
        .then((result) => {
          if (result.data) {
            store.commit(Mutation.SET_ACCESS_TOKEN, result.data.login.accessToken);
            router.push('/');
          }
        })
        .catch(() => {
          loginLoading.value = false;
          showError.value = true;
        });
    };

    return {
      loginLoading,
      loginButtonDisabled,
      email,
      password,
      handleSignIn,
      showError,
    };
  },
});
</script>