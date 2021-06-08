import MyInputField from './InputField.vue';

export default {
  title: 'UI/InputField',
  component: MyInputField,
};

const Template = (args) => ({
  components: { MyInputField },
  template: '<my-input-field />',
});

export const Default = Template.bind({});
