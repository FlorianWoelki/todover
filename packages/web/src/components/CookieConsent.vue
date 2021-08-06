<template>
  <div
    v-if="!hidden"
    class="fixed inset-0 z-50 w-full h-full bg-gray-900 opacity-75 cursor-default focus:outline-none"
  ></div>
  <div v-if="!hidden" class="fixed inset-0 z-50">
    <div
      style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      class="fixed w-full p-8 space-y-4 bg-gray-100 border border-gray-300 rounded-lg md:w-auto"
    >
      <h3 class="text-xl">🍪 We are using Cookies!</h3>
      <p class="text-gray-700">
        todover uses cookies just for logging in and registering a user. There is nothing more to
        it! If you do not trust us, check out our
        <router-link to="privacy" class="underline">Data Privacy</router-link>.
      </p>
      <td-button @click="allowButtonClicked"> Accept </td-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getCookie, refreshCookie, setCookie } from '../util/cookies';

export default defineComponent({
  setup() {
    const hidden = ref<boolean>(true);
    const cookieKey = 'cookieConsentGiven';

    onMounted((): void => {
      const cookieConsentGiven = getCookie(cookieKey);
      if (!cookieConsentGiven) {
        hidden.value = false;
      }

      refreshCookie(cookieKey);
    });

    const allowButtonClicked = (): void => {
      setCookie(cookieKey, true);
      hidden.value = true;
    };

    return {
      hidden,
      allowButtonClicked,
    };
  },
});
</script>
