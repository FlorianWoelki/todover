<script lang="ts">
import { defineComponent, h } from '@vue/runtime-core';

export default defineComponent({
  render() {
    return h(
      'input',
      {
        class:
          'w-full px-2 py-1 transition duration-150 ease-in-out focus:outline-none hover:bg-gray-100 focus:bg-gray-100',
      },
      { props: this.$attrs }
    );
  },
});
</script>
