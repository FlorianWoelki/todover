import { defineComponent, h } from 'vue';

const HideButton = defineComponent({
  name: 'HideButton',
  render() {
    return h('button', {
      tabindex: '-1',
      type: 'button',
      class: 'absolute inset-0 w-full h-full bg-black focus:outline-none opacity-10 cursor-default',
    });
  },
});

export default HideButton;
