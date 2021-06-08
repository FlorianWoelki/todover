<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 -mt-12">
    <img src="@/assets/logo.png" alt="logo" class="w-24 h-24 mb-4" />
    <h1 class="text-3xl font-bold tracking-wide mb-12 text-gray-700">Sign in to your account</h1>

    <div class="bg-white shadow rounded-lg px-10 py-8 w-full max-w-lg space-y-6">
      <input-field v-model="email" label="Email address" type="email" />
      <input-field v-model="password" label="Password" type="password" />

      <td-button @click="handleSignIn">Sign in</td-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');

    const handleSignIn = (): void => {
      console.log(email.value);
      console.log(password.value);
    };

    return {
      email,
      password,
      handleSignIn,
    };
  },
});
</script>
