<template>
  <div class="flex flex-col items-center justify-center w-full h-screen -mt-12">
    <Logo class="w-40 mb-2" />
    <h1 class="mb-8 text-3xl font-bold tracking-wide text-center text-gray-700">
      {{ $t('register.header') }}
    </h1>
    <router-link
      to="/login"
      class="mb-4 text-sm text-right text-gray-400 underline transition duration-100 ease-in-out hover:text-gray-500"
    >
      {{ $t('register.loginLink') }}
    </router-link>

    <div class="w-full max-w-lg px-10 py-8 space-y-6 bg-white rounded-lg shadow">
      <input-field
        v-model="email"
        :label="$t('register.emailLabel')"
        type="email"
        @keydown.enter="handleSignUp"
      />
      <input-field
        v-model="password"
        :label="$t('register.passwordLabel')"
        type="password"
        @keydown.enter="handleSignUp"
      />
      <input-field
        v-model="repeatPassword"
        :label="$t('register.passwordRepeatLabel')"
        type="password"
        @keydown.enter="handleSignUp"
      />

      <td-button
        :disabled="signupButtonDisabled"
        @click="handleSignUp"
        class="flex items-center justify-center"
      >
        <svg
          v-if="signupLoading"
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
        {{ $t('register.registerButton') }}
      </td-button>
    </div>
    <p v-if="showError.visible" class="mt-4 text-red-500">{{ showError.message }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import Logo from '@/assets/logo.svg';
import { isEmailValid } from '../util/validation';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import mutations from '../graphql/mutations';

interface ErrorMessage {
  message: string;
  visible: boolean;
}

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const router = useRouter();

    const email = ref<string>('');
    const password = ref<string>('');
    const repeatPassword = ref<string>('');
    const showError = reactive<ErrorMessage>({ message: '', visible: false });
    const signupLoading = ref<boolean>(false);

    const signupButtonDisabled = computed((): boolean => {
      return (
        email.value.length === 0 ||
        password.value.length === 0 ||
        password.value !== repeatPassword.value ||
        !isEmailValid(email.value)
      );
    });

    const { mutate: register } = useMutation(mutations.register);

    const handleSignUp = (): void => {
      if (signupButtonDisabled.value) {
        return;
      }

      signupLoading.value = true;

      register({ data: { email: email.value, password: password.value } })
        .then((result) => {
          if (result?.data) {
            router.push('/login');
          }
        })
        .catch((error) => {
          signupLoading.value = false;
          showError.message = error.message;
          showError.visible = true;
        });
    };

    return {
      email,
      password,
      repeatPassword,
      signupButtonDisabled,
      showError,
      signupLoading,
      handleSignUp,
    };
  },
});
</script>
