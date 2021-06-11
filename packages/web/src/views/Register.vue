<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 -mt-12">
    <Logo class="w-48 mb-2" />
    <h1 class="text-3xl font-bold tracking-wide text-gray-700 mb-8">Create a new account</h1>
    <router-link
      to="/login"
      class="mb-4 text-sm text-right text-gray-400 underline transition duration-100 ease-in-out hover:text-gray-500"
    >
      Have an account? No problem!
    </router-link>

    <div class="bg-white shadow rounded-lg px-10 py-8 w-full max-w-lg space-y-6">
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
    <p v-if="showError" class="text-red-500 mt-4">Email address is already taken.</p>
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
