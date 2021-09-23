<template>
  <modal>
    <template #title>
      <h2 class="text-xl">{{ $t('settings.title') }}</h2>
    </template>

    <div class="flex items-center mb-4 space-x-12">
      <p class="text-gray-500">
        {{ $t('settings.language.label') }}
      </p>
      <div class="relative w-full">
        <div
          class="px-4 py-2 text-gray-600 transition duration-100 ease-in-out bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
          @click="dropdownHidden = false"
        >
          {{ currentLanguage.name }}
          <span class="text-gray-500">({{ currentLanguage.slug }})</span>
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
            @click="selectLanguage(language)"
          >
            {{ language.name }}
            <span class="text-gray-500">({{ language.slug }})</span>
          </div>
        </dropdown>
      </div>
    </div>

    <a
      target="_blank"
      href="https://github.com/FlorianWoelki/todover/blob/main/README.md#want-to-help-translating"
      class="text-gray-400 transition duration-100 ease-in-out hover:text-gray-500"
    >
      {{ $t('helpTranslating') }}
    </a>
  </modal>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import mutations from '../../graphql/mutations';
import { Mutation, State } from '../../store';

interface Language {
  slug: string;
  name: string;
  default?: boolean;
}

export default defineComponent({
  setup() {
    const store = useStore<State>();
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

    const currentLanguage = computed(
      (): Language => {
        return !store.state.userSettings
          ? validLanguages.filter((lang) => lang.default)[0]
          : validLanguages.filter((lang) => lang.slug === store.state.userSettings?.language)[0];
      }
    );

    const { mutate: updateSettingsMutation } = useMutation(mutations.updateSettings);
    const selectLanguage = (language: Language): void => {
      if (store.state.me) {
        updateSettingsMutation({ data: { language: language.slug } });
      }
      store.commit(Mutation.UPDATE_SETTINGS, { language: language.slug });
      dropdownHidden.value = true;

      window.location.reload();
    };

    return {
      selectLanguage,
      dropdownHidden,
      validLanguages,
      currentLanguage,
    };
  },
});
</script>
