import {
  h,
  defineComponent,
  ref,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  toRaw,
} from 'vue';
import { deepMerge } from '../../utils/deepMerge.mjs';
import PrismiumCore from '../../core/core.mjs';

export const PRISMIUM_INJECTION_KEY = 'prismium';

export const Prismium = defineComponent({
  name: 'Prismium',
  inheritAttrs: false,
  emits: [
    'before-init',
    'init',
    'after-init',
    'before-open',
    'open',
    'after-open',
    'before-close',
    'close',
    'after-close',
    'before-destroy',
    'destroy',
    'after-destroy',
    'effect-start',
    'effect-end',
  ],
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    modules: {
      type: Array,
      default: () => [],
    },
    attributes: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots, emit, attrs }) {
    const prismiumRef = ref(null);
    const instance = ref(null);

    if (props.modules && props.modules.length) {
      PrismiumCore.use(props.modules);
    }

    const parentOptions = inject('prismiumParentOptions', {});
    const mergedOptions = deepMerge({}, parentOptions, props.options);
    provide('prismiumParentOptions', mergedOptions);

    provide(PRISMIUM_INJECTION_KEY, {
      prismiumRef,
      instance,
    });

    onMounted(() => {
      if (prismiumRef.value) {
        const defaultEvents = {
          beforeInit: () => emit('before-init', instance.value),
          init: () => emit('init', instance.value),
          afterInit: () => emit('after-init', instance.value),

          beforeOpen: () => emit('before-open', instance.value),
          open: () => emit('open', instance.value),
          afterOpen: () => emit('after-open', instance.value),

          beforeClose: () => emit('before-close', instance.value),
          close: () => emit('close', instance.value),
          afterClose: () => emit('after-close', instance.value),

          beforeDestroy: () => emit('before-destroy', instance.value),
          destroy: () => emit('destroy', instance.value),
          afterDestroy: () => emit('after-destroy', instance.value),

          effectStart: () => emit('effect-start', instance.value),
          effectEnd: () => emit('effect-end', instance.value),
        };

        const providedEvents = {
          ...(mergedOptions.on || {}),
          ...(mergedOptions.events || {}),
        };
        const combinedEvents = { ...defaultEvents, ...providedEvents };

        const finalOptions = { ...mergedOptions, on: combinedEvents };

        try {
          instance.value = new PrismiumCore(prismiumRef.value, finalOptions);
        } catch (error) {
          console.error('Failed to initialize Prismium:', error);
        }
      }
    });

    onBeforeUnmount(() => {
      try {
        const rawInstance = instance.value ? toRaw(instance.value) : null;
        if (rawInstance && !rawInstance.destroyed && rawInstance.destroy) {
          rawInstance.destroy();
        }
      } catch (error) {
        console.error('Error during destroy:', error);
      }
    });

    return () =>
      h(
        'div',
        {
          ref: prismiumRef,
          'data-prismium': '',
          ...attrs,
          ...props.attributes,
        },
        slots.default?.()
      );
  },
});
