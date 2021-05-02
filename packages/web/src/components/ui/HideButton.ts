import { Component, h } from '@vue/runtime-core';

const HideButton: Component = () => {
  return h('button', {
    tabindex: '-1',
    type: 'button',
    class: 'absolute inset-0 w-full h-full bg-black focus:outline-none opacity-10',
  });
};

export default HideButton;
