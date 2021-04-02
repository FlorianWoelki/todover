<script lang="ts">
import { defineComponent, h, InjectionKey, provide } from '@vue/runtime-core';

export const dateKey: InjectionKey<Date> = Symbol('Date');
export const activeItemKey: InjectionKey<number> = Symbol('ActiveItem');

export default defineComponent({
  props: {
    currentDate: {
      type: Date,
      required: true,
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
    return h('div', { class: 'grid grid-cols-5' }, this.$slots);
  },
});
</script>
