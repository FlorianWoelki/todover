import MyTitleInput from './TitleInput.vue';

export default {
  title: 'UI/TitleInput',
  component: MyTitleInput,
};

const Template = (args) => ({
  components: { MyTitleInput },
  template: '<my-title-input />',
});

export const Default = Template.bind({});
