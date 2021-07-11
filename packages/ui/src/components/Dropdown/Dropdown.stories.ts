import MyDropdown from './Dropdown.vue';

export default {
  title: 'UI/Dropdown',
  component: MyDropdown,
};

const Template = () => ({
  components: { MyDropdown },
  template: '<my-dropdown><p>Test Item 1</p><p>Test Item 2</p></my-dropdown>',
});

export const Default = Template.bind({});
