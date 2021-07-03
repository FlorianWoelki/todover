<template>
  <modal>
    <template #title>
      <h2 class="text-xl">{{ $t('settings.title') }}</h2>
    </template>

    <div class="flex items-center space-x-12">
      <p class="text-gray-500">Language</p>
      <div class="relative w-full">
        <div
          class="px-4 py-2 text-gray-600 transition duration-100 ease-in-out bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
          @click="dropdownHidden = false"
        >
          English
        </div>

        <dropdown
          #="{ itemClasses }"
          class="inset-x-0 w-full ml-0 bg-white"
          :dropdownHidden="dropdownHidden"
          @close.stop="dropdownHidden = true"
        >
          <div
            v-for="(language, index) in validLanguages"
            :key="index"
            class="text-gray-800 hover:bg-gray-100"
            :class="itemClasses"
          >
            {{ language.name }}
            <span class="text-gray-500">({{ language.slug }})</span>
          </div>
        </dropdown>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface Language {
  slug: string;
  name: string;
  default?: boolean;
}

export default defineComponent({
  setup() {
    const validLanguages: Language[] = [
      {
        slug: 'en',
        name: 'English',
        default: true,
      },
      {
        slug: 'de',
        name: 'German',
      },
    ];
    const dropdownHidden = ref<boolean>(true);

    return {
      dropdownHidden,
      validLanguages,
    };
  },
});
</script>
