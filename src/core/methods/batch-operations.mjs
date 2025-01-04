import { processAccordions, getElementDepth } from "../../utils/base.mjs";

export default {
  // Открыть все аккордеоны в контейнере | Open all accordions in the container
  openAll(container, selector = ".prismium") {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    const accordions = Array.from(container.querySelectorAll(selector));

    // Сортировка аккордеонов по глубине | Sort accordions by depth
    accordions.sort((a, b) => {
      const depthA = getElementDepth(a, container);
      const depthB = getElementDepth(b, container);
      return depthB - depthA;
    });

    const rootAccordions = accordions.filter(el => !el.closest(".prismium__content"));
    const nestedAccordions = accordions.filter(el => el.closest(".prismium__content"));

    this._isOpeningAll = true;
    processAccordions(nestedAccordions, rootAccordions, this.getInstance.bind(this), this.open.bind(this));
    this._isOpeningAll = false;
  },

  // Закрыть все аккордеоны в контейнере | Close all accordions in the container
  closeAll(container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    container.querySelectorAll(`.${this.options.activeClass}`).forEach((el) => {
      const instance = this.getInstance(el);
      this.close(el);
      if (instance && instance.iconManager) {
        instance.iconManager.updateIcon("close");
      }
    });
  },

  // Открыть все аккордеоны на странице | Open all accordions on the page
  openEverything(selector = ".prismium") {
    const accordions = Array.from(document.querySelectorAll(selector));

    // Сортировка аккордеонов по глубине | Sort accordions by depth
    accordions.sort((a, b) => {
      const depthA = getElementDepth(a, document.body);
      const depthB = getElementDepth(b, document.body);
      return depthB - depthA;
    });

    const rootAccordions = accordions.filter(el => !el.closest(".prismium__content"));
    const nestedAccordions = accordions.filter(el => el.closest(".prismium__content"));

    this._isOpeningEverything = true;
    processAccordions(nestedAccordions, rootAccordions, this.getInstance.bind(this), this.open.bind(this));
    this._isOpeningEverything = false;
  },

  // Закрыть все аккордеоны на странице | Close all accordions on the page
  closeEverything() {
    document.querySelectorAll(`.${this.options.activeClass}`).forEach((el) => {
      const instance = this.getInstance(el) || this;

      instance.close(el);
    });
  },

  // Закрыть вложенные аккордеоны | Close nested accordions
  closeNested(el) {
    el.querySelectorAll(`.${this.options.activeClass}`).forEach((nested) => {
      const instance = this.getInstance(nested);
      instance.close(nested);
    });
  },
};
