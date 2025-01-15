import { PrismiumError } from "../errors/PrismiumError.mjs";

export class DOMManager {
  // Настройка DOM-элемента | Setup DOM element
  setup(instance, el) {
    this.validateElement(el);
    this.instance = instance;
    this.createStructure(el);
    this.setClasses(el);
    this.setTheme(el);
    this.handleInitialState(el);
    return this;
  }

  // Проверка валидности элемента | Validate element
  validateElement(el) {
    if (!el) {
      throw new PrismiumError("Element is required");
    }

    if (!(el instanceof Element)) {
      throw new PrismiumError("Invalid element type. Expected HTMLElement");
    }

    if (!el.children || !el.children.length) {
      throw new PrismiumError("Element must have children");
    }
  }

  // Создание структуры DOM | Create DOM structure
  createStructure(el) {
    const content = el.querySelector(this.instance.options.contentSelector);
    const current = el.querySelector(this.instance.options.currentSelector);

    let hidden;

    if (!content || !current) {
      throw new Error("Required elements not found");
    }

    this.instance.$content = content;
    this.instance.$current = current;

    if (content.parentElement === content.closest(this.instance.options.hiddenSelector)) {
      hidden = content.parentElement;
    } else {
      hidden = document.createElement("div");
      hidden.appendChild(content);
      el.appendChild(hidden);
    }

    this.instance.$hidden = hidden;
    
    this.instance.$binding = this.instance.options.getParentHeight ? el : content;

    let containerSelectors = Array.isArray(this.instance.options.containerSelectors)
    ? this.instance.options.containerSelectors
    : [this.instance.options.containerSelectors];
    this.instance.$container = el.closest(containerSelectors.find(selector => el.closest(selector)));
  }

  // Установка классов | Set classes
  setClasses(el) {
    el.classList.add("prismium");
    this.instance.$current.classList.add("prismium__current");
    this.instance.$content.classList.add("prismium__content");
    this.instance.$hidden.classList.add("prismium__hidden");
  }

  // Установка темы | Set theme
  setTheme(el) {
    const { theme } = this.instance.options;
    if (theme) {
      el.classList.add(`prismium_${theme}`);

      if (typeof theme === "object") {
        Object.entries(theme).forEach(([key, value]) => {
          if (value) {
            el.classList.add(`prismium_${key}`);
          }
        });
      }
    }
  }

  // Обработка начального состояния | Handle initial state
  handleInitialState(el) {
    if (el.classList.contains(this.instance.options.activeClass)) {
      el.classList.remove(this.instance.options.activeClass);
      this.instance.$hidden.classList.add(this.instance.options.openedClass);
      this.instance.on("afterInit", () => {
        this.instance.open(el);
      });
    } else {
      this.instance.opened = false;
    }
  }

  // Очистка DOM-элемента | Cleanup DOM element
  cleanup() {
    if (this.instance.$content && this.instance.$hidden) {
      this.instance.el.appendChild(this.instance.$content);
      this.instance.$hidden.remove();
    }
  }
}
