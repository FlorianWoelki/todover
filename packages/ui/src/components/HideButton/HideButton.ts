import { defineComponent, h } from 'vue';

const HideButton = defineComponent({
  name: 'HideButton',
  render() {
    return h('button', {
      tabindex: '-1',
      type: 'button',
      class: 'absolute inset-0 w-full h-full focus:outline-none cursor-default',
      style: 'background-color: rgba(0, 0, 0, 0.15)',
    });
  },
});

export default HideButton;
