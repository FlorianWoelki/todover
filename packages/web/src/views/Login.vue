<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 -mt-12">
    <Logo class="w-48 mb-2" />
    <h1 class="text-3xl font-bold tracking-wide text-gray-700 mb-8">Sign in to your account</h1>
    <router-link
      to="/register"
      class="mb-4 text-sm text-right text-gray-400 underline transition duration-100 ease-in-out hover:text-gray-500"
    >
      No account? No problem!
    </router-link>

    <div class="bg-white shadow rounded-lg px-10 py-8 w-full max-w-lg space-y-6">
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
    <p v-if="showError" class="text-red-500 mt-4">Wrong email address or password</p>
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
