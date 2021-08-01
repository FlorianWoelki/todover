<template>
  <div class="absolute bottom-0 right-0 mx-4 mb-8 space-x-6 text-sm text-gray-300 md:text-base">
    <a href="https://github.com/FlorianWoelki/" target="_blank" class="hover:text-gray-400">
      Made by Florian Woelki
    </a>

    <router-link to="/imprint" class="hover:text-gray-400">
      {{ $t('navbar.imprintButton') }}
    </router-link>
    <router-link to="/dataprivacy" class="hover:text-gray-400">
      {{ $t('navbar.privacyButton') }}
    </router-link>
  </div>
</template>
