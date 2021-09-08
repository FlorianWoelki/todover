import { defineComponent, h } from 'vue';

const DropdownBorder = defineComponent({
  name: 'DropdownBorder',
  render() {
    return h('div', {
      class: 'my-2 border-b border-gray-700',
    });
  },
});

export default DropdownBorder;
