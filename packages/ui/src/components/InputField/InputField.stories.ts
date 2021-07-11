import MyInputField from './InputField.vue';

export default {
  title: 'UI/InputField',
  component: MyInputField,
};

const Template = () => ({
  components: { MyInputField },
  template: '<my-input-field />',
});

export const Default = Template.bind({});
