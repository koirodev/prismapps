import { deepMerge } from "../utils/deepMerge.mjs";

import { DOMManager } from "./managers/DOMManager.mjs";
import { IconManager } from "./managers/IconManager.mjs";
import { TimerManager } from "./managers/TimerManager.mjs";

import eventsEmitter from "./methods/events-emitter.mjs";
import actions from "./methods/actions.mjs";
import batchOperations from "./methods/batch-operations.mjs";
import destroy from "./methods/destroy.mjs";

import defaultOptions from "./options.mjs";

// Прототипы методов | Method prototypes
const prototypes = {
  eventsEmitter,
  actions,
  batchOperations,
  destroy
};

class Prismium {
  static __modules__ = new Map();

  // Использовать модуль | Use a module
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => this.use(m));
      return this;
    }

    if (!module || !module.name) {
      throw new Error("Module must have a name");
    }

    this.__modules__.set(module.name, module);
    return this;
  }

  constructor(...args) {
    let el, options;

    // Проверка аргументов конструктора | Check constructor arguments
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      options = args[0];
    } else {
      [el, options] = args;
    }

    if (!options)
      options = {};

    options = deepMerge({}, options);

    if (el && !options.el)
      options.el = el;

    // Обработка строкового селектора | Handle string selector
    if (options.el && typeof options.el === "string") {
      const prismiumArray = [];

      document.querySelectorAll(options.el).forEach((el) => {
        const newOptions = deepMerge({}, options, { el: el });
        prismiumArray.push(new Prismium(newOptions));
      });

      return new Proxy(prismiumArray, {
        get(target, prop) {
          if (Array.prototype[prop]) {
            return target[prop].bind(target);
          }

          const multiInstanceMethods = [
            "on", "once", "onAny", "off",
            "offAny", "emit", "init", "destroy",
          ];

          if (multiInstanceMethods.includes(prop)) {
            return (...args) => {
              const results = target.map(instance => {
                return instance[prop].apply(instance, args);
              });
              return target;
            };
          }

          if (typeof target[0][prop] === "function") {
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
    this.el = null;

    this.domManager = new DOMManager();
    this.iconManager = new IconManager();
    this.timerManager = new TimerManager();
    this.__modules__ = new Map();

    // Установка модулей | Install modules
    Prismium.__modules__.forEach((module, name) => {
      if (typeof module.install === "function") {
        try {
          module.install(this);
          this.__modules__.set(name, module);
        } catch (error) {
          console.error(`Failed to install module ${name}:`, error);
        }
      }
    });

    // Монтирование элемента | Mount element
    if (this.options.el) {
      this.mount(this.options.el);
    }

    // Инициализация | Initialization
    if (this.options.init) {
      this.init();
    }
  }

  // Монтирование элемента | Mount element
  mount(el) {
    if (typeof el === "string") {
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
  init() {
    if (this.initialized && !this.destroyed) return this;
    if (!this.el) return this;

    this.emit("beforeInit");

    try {
      if (this.destroyed || !this.domManager || !this.iconManager || !this.timerManager) {
        this.domManager = new DOMManager();
        this.iconManager = new IconManager();
        this.timerManager = new TimerManager();
        this.destroyed = false;
        this.initialized = false;
      }

      this.domManager.setup(this, this.el);

      if (typeof this.options.speed === "number") {
        this.setupSpeed(this.options.speed);
      } else if (typeof this.options.speed === "object") {
        this.setupSpeed(this.options.speed.open, this.options.speed.close);
      }

      if (this.$current) {
        this.iconManager.setup(this, this.$current);
        this.bindEvents(this.el);
      }

      this.__modules__.forEach(module => {
        if (typeof module.init === "function") {
          module.init(this);
        }
      });

      this.initialized = true;
      this.el.__prismiumInstance__ = this;
      this.emit("init");

    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }

    this.emit("afterInit");
    return this;
  }

  // Настройка скорости | Setup speed
  setupSpeed(open, close) {
    this.speed = {
      open: open || 350,
      close: close || open || 350
    };

    if (!this._isOpeningAll && !this._isOpeningEverything && !this._originalSpeed) {
      this.el.style.setProperty("--prismium-speed", `${this.opened ? this.speed.close : this.speed.open}ms`);
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
      
      this.$current.addEventListener("click", handler);
      this.$current._hasClickHandler = true;
      this.$current._clickHandler = handler;
    }
  }

  // Обработчик кликов | Click handler
  clickHandler(el) {
    const instance = this.getInstance(el) || this;

    if (instance.options.autoClose && instance.$container) {
      const openedItems = instance.$container.querySelectorAll(`.${instance.options.activeClass}`);
      openedItems.forEach(item => {
        if (!el.contains(item) && !item.contains(el)) {
          const itemInstance = this.getInstance(item);
          this.close(item);
          if (itemInstance && itemInstance.iconManager) {
            itemInstance.iconManager.updateIcon("close");
          }
        }
      });
    }

    if (instance.options.autoCloseNested) {
      const containerEl = instance.$current.closest(`.${instance.options.activeClass}`);
      if (containerEl) {
        const nestedItems = containerEl.querySelectorAll(`.${instance.options.activeClass}`);
        nestedItems.forEach(nested => {
          if (nested !== el && !nested.contains(el)) {
            const nestedInstance = this.getInstance(nested);
            this.close(nested);
            if (nestedInstance && nestedInstance.iconManager) {
              nestedInstance.iconManager.updateIcon("close");
            }
          }
        });
      }
    }

    if (instance.$current.closest(`.${instance.options.content}`)) {
      return;
    }

    this.toggle(el);
  }

  // Переключение состояния | Toggle state
  toggle(el) {
    const instance = this.getInstance(el) || this;
    if (instance.opened) {
      this.close(el);
    } else {
      this.open(el);
    }
  }
}

// Добавление методов в прототип | Add methods to prototype
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Prismium.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});

export default Prismium;
