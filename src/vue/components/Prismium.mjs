import { h, defineComponent, ref, provide, onMounted, onBeforeUnmount } from "vue";
import PrismiumCore from '../../core/core.mjs';

export const PRISMIUM_INJECTION_KEY = "prismium";

export const Prismium = defineComponent({
  name: 'Prismium',
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots, emit }) {
    const prismiumRef = ref(null);
    const instance = ref(null);

    provide(PRISMIUM_INJECTION_KEY, {
      prismiumRef,
      instance
    });

    onMounted(() => {
      // ...existing code...
    });

    onBeforeUnmount(() => {
      if (instance.value) {
        instance.value.destroy?.();
      }
    });

    return () => h("div", {
      ref: prismiumRef,
      "data-prismium": ""
    }, slots.default?.());
  }
});

export default Prismium;
