import { PrismiumError } from './errors/PrismiumError.mjs';
import { deepMerge } from '../utils/deepMerge.mjs';

import { DOMManager } from './managers/DOMManager.mjs';
import { IconManager } from './managers/IconManager.mjs';
import { TimerManager } from './managers/TimerManager.mjs';

import eventsEmitter from './methods/events-emitter.mjs';
import actions from './methods/actions.mjs';
import batchOperations from './methods/batch-operations.mjs';
import destroy from './methods/destroy.mjs';
import { publicMethods } from './methods/public-api.mjs';

import defaultOptions from './options.mjs';

// Прототипы методов | Method prototypes
const prototypes = {
  eventsEmitter,
  actions,
  batchOperations,
  destroy,
};

class Prismium {
  static __modules__ = new Map();
  static __instances__ = new Map();

  // Публичные методы как статические
  static open = publicMethods.open;
  static openAll = publicMethods.openAll;
  static openEverything = publicMethods.openEverything;
  static close = publicMethods.close;
  static closeAll = publicMethods.closeAll;
  static closeEverything = publicMethods.closeEverything;

  // Использовать модуль | Use a module
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => this.use(m));
      return this;
    }

    if (!module || !module.name) {
      throw new PrismiumError('Module must have a name');
    }

    this.__modules__.set(module.name, module);
    return this;
  }

  constructor(...args) {
    let el, options;    

    // Проверка аргументов конструктора | Check constructor arguments
    if (args.length === 1
      && args[0].constructor
      && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      options = args[0];
    } else {
      [el, options] = args;
    }

    if (!options) {
      options = {};
    }

    options = deepMerge({}, options);

    if (el && !options.el) {
      options.el = el;
    }

    if (!this.el) {
      this.el = options.el;
    }

    // Обработка строкового селектора | Handle string selector
    if (this.el && typeof this.el === 'string') {
      const elements = document.querySelectorAll(this.el);
      const prismiumArray = Array.from(elements).map(el => {
        
        // Проверяем, есть ли уже инициализированный экземпляр | Check if instance is already initialized
        if (Prismium.__instances__.has(el)) {
          return Prismium.__instances__.get(el);
        }
        const newOptions = deepMerge({}, options, { el }); // Удаляем init: true | Remove init: true
        const instance = new Prismium(newOptions);
        Prismium.__instances__.set(el, instance);
        return instance;
      });

      return new Proxy(prismiumArray, {
        get(target, prop) {
          if (Array.prototype[prop]) {
            return target[prop].bind(target);
          }

          const multiInstanceMethods = [
            'on', 'once', 'onAny', 'off',
            'offAny', 'emit', 'init', 'destroy',
          ];

          if (multiInstanceMethods.includes(prop)) {
            return (...args) => {
              const results = target.map(instance => {
                return instance[prop].apply(instance, args);
              });
              return target;
            };
          }

          if (typeof target[0][prop] === 'function') {
            return target[0][prop].bind(target[0]);
          }

          return target[0][prop];
        }
      });
    }

    this.options = deepMerge({}, defaultOptions, options);
    this.__prismium__ = true;
    this.eventsListeners = {};
    this.eventsAnyListeners = [];
    this.__modules__ = new Map();

    // Регистрация событий | Register events
    if (this.options && this.options.on) {
      Object.keys(this.options.on).forEach((eventName) => {
        this.on(eventName, this.options.on[eventName]);
      });
    }
    if (this.options && this.options.onAny) {
      this.onAny(this.options.onAny);
    }

    this.destroyed = false;
    this.initialized = false;
    this.opened = false;

    this.domManager = new DOMManager();
    this.iconManager = new IconManager();
    this.timerManager = new TimerManager();

    // Установка модулей перед монтированием и инициализацией | Setup modules before mounting and initializing
    const moduleSetupPromise = Promise.resolve().then(() => {
      Prismium.__modules__.forEach((module, name) => {
        if (typeof module.install === 'function') {
          try {
            module.install(this);
            this.__modules__.set(name, module);
          } catch (error) {
            throw new PrismiumError(`Failed to install module ${name}`, error);
          }
        }
      });

      // Монтирование элемента только если указан el | Mount element only if el is specified
      if (this.options.el) {
        this.mount(this.options.el);
      }

      // Инициализация только после установки модулей | Initialize only after modules are installed
      if (this.options.init === true) {
        this.init();
      }
    });

    // Сохраняем промис для возможной проверки завершения инициализации | Save promise for possible initialization check
    this.__initPromise = moduleSetupPromise;
  }

  // Монтирование элемента | Mount element
  mount(el) {
    if (!el) {
      throw new PrismiumError('Element is required');
    }

    if (!(el instanceof Element)) {
      throw new PrismiumError('Invalid element type');
    }

    if (typeof el === 'string') {
      const elements = document.querySelectorAll(el);
      if (elements.length > 1) {
        return Array.from(elements).map(el => new this.constructor({ ...this.options, el }));
      }
      el = elements[0];
    }

    this.el = el;
    return this;
  }

  // Инициализация | Initialization
  init(el = this.el) {
    if (this.initialized) {
      return `this`;
    }

    if (!el) {
      throw new PrismiumError('Element is required');
    }

    if (!(el instanceof Element)) {
      throw new PrismiumError('Invalid element type');
    }

    this.destroyed = false;
    this.emit('beforeInit');

    // Проверяем существующий экземпляр
    const existingInstance = Prismium.__instances__.get(el) || el.__prismiumInstance__;
    if (existingInstance) {
      if (existingInstance.destroyed) {
        Object.assign(this, {
          options: existingInstance.options,
          eventsListeners: existingInstance.eventsListeners,
          eventsAnyListeners: existingInstance.eventsAnyListeners,
          __modules__: existingInstance.__modules__
        });

        Prismium.__instances__.set(el, this);
      } else if (existingInstance.initialized) {
        return existingInstance;
      }
    }

    try {
      this.domManager = new DOMManager();
      this.iconManager = new IconManager();
      this.timerManager = new TimerManager();

      // Восстанавливаем опции если они были очищены | Restore options if they were cleared
      if (!this.options) {
        this.options = { ...defaultOptions };
      }

      // Восстанавливаем слушатели событий если они были уничтожены | Restore event listeners if they were destroyed
      if (!this.eventsListeners) {
        this.eventsListeners = {};
      }
      if (!this.eventsAnyListeners) {
        this.eventsAnyListeners = [];
      }

      // Если это существующий экземпляр, восстанавливаем его слушатели | If it's an existing instance, restore its listeners
      const existingInstance = el.__prismiumInstance__;
      if (existingInstance && existingInstance.eventsListeners) {
        this.eventsListeners = { ...existingInstance.eventsListeners };
        this.eventsAnyListeners = [...existingInstance.eventsAnyListeners];
      }

      // Монтируем элемент | Mount element
      if (!this.el || this.el !== el) {
        this.mount(el);
      }

      // Настройка элемента | Setup element
      el.classList.add('prismium');

      if (this.options.theme) {
        el.classList.add(`prismium_${this.options.theme}`);
      }

      // Инициализация DOM и менеджеров | Initialize DOM and managers
      this.domManager.setup(this, el);

      if (this.$current) {
        this.iconManager = new IconManager();
        this.iconManager.setup(this, this.$current);
        this.bindEvents(el);
      }

      if (typeof this.options.speed === 'number') {
        this.setupSpeed(this.options.speed);
      } else if (typeof this.options.speed === 'object') {
        this.setupSpeed(this.options.speed.open, this.options.speed.close);
      }

      // Инициализация модулей | Initialize modules
      this.__modules__.forEach(module => {
        if (typeof module.init === 'function') {
          module.init(this);
        }
      });

      el.__prismiumInstance__ = this;
      Prismium.__instances__.set(el, this);

      this.initialized = true;
      this.el.prismium = this;
      this.el.classList.add('prismium-initialized');
      this.emit('init');
    } catch (error) {
      console.error('Initialization error:', error);
      throw new PrismiumError('Initialization error', error);
    }

    this.emit('afterInit');
    return this;
  }

  // Настройка скорости | Setup speed
  setupSpeed(open, close) {
    this.speed = {
      open: open || 350,
      close: close || open || 350
    };

    if (!this._isOpeningAll && !this._isOpeningEverything && !this._originalSpeed) {
      this.el.style.setProperty('--prismium-speed', `${this.opened ? this.speed.close : this.speed.open}ms`);
    }
  }

  // Получить экземпляр | Get instance
  getInstance(el) {
    if (!el) return null;
    return el.__prismiumInstance__;
  }

  // Привязка событий | Bind events
  bindEvents(el) {
    if (this.$current && !this.$current._hasClickHandler) {
      const handler = (event) => {
        event.preventDefault();
        if (!this.destroyed) {
          this.clickHandler(el);
        }
      };

      this.$current.addEventListener('click', handler);
      this.$current._hasClickHandler = true;
      this.$current._clickHandler = handler;
    }
  }

  // Обработчик кликов | Click handler
  clickHandler(el) {
    const instance = this.getInstance(el);
    if (!instance) return;

    // Используем контекст конкретного экземпляра | Use context of the specific instance
    if (instance.options.autoClose && instance.$container) {
      const openedItems = instance.$container.querySelectorAll(`.${instance.options.activeClass}`);
      openedItems.forEach(item => {
        const itemInstance = item.__prismiumInstance__;
        if (itemInstance && !el.contains(item) && !item.contains(el)) {
          itemInstance.close(item);
        }
      });
    }

    if (instance.options.autoCloseNested) {
      const containerEl = instance.$current.closest(`.${instance.options.activeClass}`);
      if (containerEl) {
        const nestedItems = containerEl.querySelectorAll(`.${instance.options.activeClass}`);
        nestedItems.forEach(nested => {
          const nestedInstance = nested.__prismiumInstance__;
          if (nestedInstance && nested !== el && !nested.contains(el)) {
            nestedInstance.close(nested);
          }
        });
      }
    }

    if (instance.$current.closest(`.${instance.options.content}`)) {
      return;
    }

    if (instance.opened) {
      instance.close(el);
    } else {
      instance.open(el, true);
    }
  }

  // Переключение состояния | Toggle state
  toggle(el) {
    const instance = this.getInstance(el);
    if (!instance) return;

    if (instance.opened) {
      instance.close(el);
    } else {
      instance.open(el, true);
    }
  }
}

// Добавление методов в прототип | Add methods to prototype
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Prismium.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});

// Сделаем класс доступным глобально сначала
globalThis.Prismium = Prismium;

// Теперь добавим публичные методы
Object.assign(globalThis.Prismium, {
  openAll: Prismium.openAll.bind(Prismium),
  closeAll: Prismium.closeAll.bind(Prismium),
  openEverything: Prismium.openEverything.bind(Prismium),
  closeEverything: Prismium.closeEverything.bind(Prismium)
});

export default Prismium;
