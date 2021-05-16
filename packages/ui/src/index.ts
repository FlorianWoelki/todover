import type { App, Plugin } from 'vue';
import Datepicker from './components/Datepicker/Datepicker.vue';
import HideButton from './components/HideButton/HideButton';

const components = [Datepicker, HideButton];
export { Datepicker, HideButton };

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
