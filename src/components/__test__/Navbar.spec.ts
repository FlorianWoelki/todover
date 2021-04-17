import { mount } from '@vue/test-utils';
import Navbar from '../Navbar.vue';

describe('Navbar.vue', () => {
  test('component is rendering', () => {
    const wrapper = mount<any>(Navbar);
    expect(wrapper.html()).toBeTruthy();
  });
});
