import { h, defineComponent } from 'vue';

export const PrismiumCurrent = defineComponent({
  name: 'PrismiumCurrent',
  props: {
    selector: {
      type: String,
      default: 'div',
    },
    attributes: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        props.selector,
        {
          'data-prismium-current': '',
          ...attrs,
          ...props.attributes,
        },
        slots.default?.()
      );
  },
});

export default PrismiumCurrent;
