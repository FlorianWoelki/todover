<script lang="ts">
import { defineComponent, h, InjectionKey, provide } from '@vue/runtime-core';

export const dateKey: InjectionKey<Date> = Symbol('Date');

export default defineComponent({
  props: {
    currentDate: {
      type: Date,
      required: true,
    },
  },
  setup(props) {
    provide(dateKey, props.currentDate);
  },
  render() {
    return h('div', {}, this.$slots);
  },
});
</script>
