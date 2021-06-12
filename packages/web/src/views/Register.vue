<template>
  <div class="flex flex-col items-center justify-center w-full h-screen -mt-12">
    <Logo class="w-48 mb-2" />
    <h1 class="mb-8 text-3xl font-bold tracking-wide text-center text-gray-700">
      Create a new account
    </h1>
    <router-link
      to="/login"
      class="mb-4 text-sm text-right text-gray-400 underline transition duration-100 ease-in-out hover:text-gray-500"
    >
      Have an account? No problem!
    </router-link>

    <div class="w-full max-w-lg px-10 py-8 space-y-6 bg-white rounded-lg shadow">
      <input-field
        v-model="email"
        label="Email address"
        type="email"
        @keydown.enter="handleSignUp"
      />
      <input-field
        v-model="password"
        label="Password"
        type="password"
        @keydown.enter="handleSignUp"
      />
      <input-field
        v-model="repeatPassword"
        label="Repeat password"
        type="password"
        @keydown.enter="handleSignUp"
      />

      <td-button :disabled="signupButtonDisabled" @click="handleSignUp">Create account</td-button>
    </div>
    <p v-if="showError" class="mt-4 text-red-500">Email address is already taken.</p>
  </div>
</template>

<script lang="ts">
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
    const repeatPassword = ref<string>('');

    const signupButtonDisabled = computed((): boolean => {
      return (
        email.value.length === 0 ||
        password.value.length === 0 ||
        password.value !== repeatPassword.value ||
        !isEmailValid(email.value)
      );
    });

    const handleSignUp = (): void => {};

    return {
      email,
      password,
      repeatPassword,
      signupButtonDisabled,
      handleSignUp,
    };
  },
});
</script>
