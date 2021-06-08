import type { App, Plugin } from 'vue';
import Datepicker from './components/Datepicker/Datepicker.vue';
import TitleInput from './components/TitleInput/TitleInput.vue';
import Searchbar from './components/Searchbar/Searchbar.vue';
import HideButton from './components/HideButton/HideButton';
import InputField from './components/InputField/InputField.vue';

const components = [Datepicker, HideButton, TitleInput, Searchbar, InputField];
export { Datepicker, HideButton, TitleInput, Searchbar, InputField };

function install(app: App): void {
  for (const comp of components) {
    switch (true) {
      case typeof comp.install === 'function':
        comp.install(app);
        break;
      default:
        app.component(comp.name, comp);
    }
  }
}

export default <Plugin>{
  version: '__VERSION__',
  install,
};
