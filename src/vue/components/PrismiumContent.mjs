import { h, defineComponent } from 'vue';

export const PrismiumContent = defineComponent({
  name: 'PrismiumContent',
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
          'data-prismium-content': '',
          ...attrs,
          ...props.attributes,
        },
        slots.default?.()
      );
  },
});

export default PrismiumContent;
