import MyDatepicker from './Datepicker.vue';

export default {
  title: 'UI/Datepicker',
  component: MyDatepicker,
};

const Template = (args) => ({
  components: { MyDatepicker },
  template: '<my-datepicker />',
});

export const Default = Template.bind({});
