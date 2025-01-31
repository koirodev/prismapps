export const publicMethods = {
  open(el, scrollTo = true) {
    const instance = new this();
    return instance.open(el, scrollTo);
  },

  openAll(container, selector = '.prismium') {
    const instance = new this();
    return instance.openAll(container, selector);
  },

  close(el) {
    const instance = new this();
    return instance.close(el);
  },

  closeAll(container) {
    const instance = new this();
    return instance.closeAll(container);
  },

  openEverything(selector = '.prismium') {
    const instance = new this();
    return instance.openEverything(selector);
  },

  closeEverything(selector = '.prismium') {
    const instance = new this();
    return instance.closeEverything(selector);
  }
};
