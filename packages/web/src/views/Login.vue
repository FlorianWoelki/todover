<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 -mt-12">
    <img src="@/assets/logo.png" alt="logo" class="w-24 h-24 mb-4" />
    <h1 class="text-3xl font-bold tracking-wide mb-12 text-gray-700">Sign in to your account</h1>

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

      <td-button @click="handleSignIn">Sign in</td-button>
    </div>
    <p v-if="showError" class="text-red-500 mt-4">Wrong email address or password</p>
  </div>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { defineComponent, ref } from 'vue';

export default defineComponent({
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

    const isEmailValid = (): boolean => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.value.toLowerCase());
    };

    const handleSignIn = (): void => {
      if (email.value.length === 0 || password.value.length === 0 || !isEmailValid()) {
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
      email,
      password,
      handleSignIn,
      showError,
    };
  },
});
</script>
