<template>
  <div class="flex flex-col items-center justify-center w-full h-screen -mt-12 bg-gray-50">
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

      <td-button :disabled="loginButtonDisabled" @click="handleSignIn">Sign in</td-button>
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

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');
    const showError = ref<boolean>(false);

    const { mutate: login } = useMutation(gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
        }
      }
    `);

    const loginButtonDisabled = computed((): boolean => {
      return email.value.length === 0 || password.value.length === 0 || !isEmailValid(email.value);
    });

    const handleSignIn = (): void => {
      if (loginButtonDisabled) {
        return;
      }

      login({ email: email.value, password: password.value })
        .then((result) => {
          console.log('res', result);
        })
        .catch(() => {
          showError.value = true;
        });
    };

    return {
      loginButtonDisabled,
      email,
      password,
      handleSignIn,
      showError,
    };
  },
});
</script>
