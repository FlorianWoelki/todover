<script lang="ts">
import { defineComponent, h, provide } from '@vue/runtime-core';
import { dateKey, activeItemKey } from '@/symbols/day-grid';

export default defineComponent({
  props: {
    currentDate: {
      type: Date,
      required: false,
    },
    activeItem: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    provide(dateKey, props.currentDate);
    provide(activeItemKey, props.activeItem);
  },
  render() {
    return h('div', { class: 'grid grid-cols-1 lg:grid-cols-5' }, this.$slots);
  },
});
</script>
