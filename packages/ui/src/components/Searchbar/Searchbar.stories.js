import MySearchbar from './Searchbar.vue';

export default {
  title: 'UI/Searchbar',
  component: MySearchbar,
};

const Template = (args) => ({
  components: { MySearchbar },
  template: '<my-searchbar />',
});

export const Default = Template.bind({});
