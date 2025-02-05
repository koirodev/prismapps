import { deepMerge } from '../utils/deepMerge.mjs';
import { EffectsManager } from '../core/managers/EffectsManager.mjs';

export default {
  name: 'effects',

  // Опции по умолчанию для эффектов | Default options for effects
  defaultOptions: {
    effect: null,
    effectIgnore: ['[data-effect-ignore]'],
  },

  // Установка модуля эффектов | Install effects module
  install(instance) {
    deepMerge({}, this.defaultOptions, instance.options);

    instance.effectsManager = new EffectsManager();
  },
};
