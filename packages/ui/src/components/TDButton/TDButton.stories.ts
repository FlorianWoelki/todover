import MyButton from './TDButton.vue';

export default {
  title: 'UI/Button',
  component: MyButton,
};

const Template = (args: any) => ({
  components: { MyButton },
  template: `<my-button :disabled="${args.disabled}">Register</my-button>`,
});

export const Default = Template.bind({
  disabled: false,
});
