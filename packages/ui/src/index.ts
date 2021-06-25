import type { App, Plugin } from 'vue';
import Datepicker from './components/Datepicker/Datepicker.vue';
import TitleInput from './components/TitleInput/TitleInput.vue';
import Searchbar from './components/Searchbar/Searchbar.vue';
import HideButton from './components/HideButton/HideButton';
import InputField from './components/InputField/InputField.vue';
import TDButton from './components/TDButton/TDButton.vue';
import Dropdown from './components/Dropdown/Dropdown.vue';

const components = [Datepicker, HideButton, TitleInput, Searchbar, InputField, TDButton, Dropdown];
export { Datepicker, HideButton, TitleInput, Searchbar, InputField, TDButton, Dropdown };

function install(app: App): void {
  for (const comp of components) {
    if (comp.name) {
      app.component(comp.name, comp);
    } else {
      console.error(comp, ' has no name!');
    }
  }
}

export default <Plugin>{
  version: '__VERSION__',
  install,
};
