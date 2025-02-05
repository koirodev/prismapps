export default {
  destroy() {
    if (!this.initialized || this.destroyed) return this;

    this.emit('beforeDestroy');

    try {
      const PrismiumClass = Object.getPrototypeOf(this).constructor;
      const currentEl = this.el;

      // Сохраняем только важные состояния | Save only important states
      const savedState = {
        options: { ...this.options },
        __modules__: new Map(this.__modules__),
      };

      // Проверка подключения элемента | Check if element is connected
      if (this.el && !this.el.isConnected) {
        return this;
      }

      // Очистка основного элемента | Clean up main element
      if (currentEl) {
        currentEl.classList.remove('prismium', this.options.activeClass);
        currentEl.style.removeProperty('--prismium-speed');
      }

      // Очистка текущего элемента | Clean up current element
      if (this.$current && this.$current.isConnected) {
        this.$current.classList.remove('prismium__current');
        if (this.$current._clickHandler) {
          this.$current.removeEventListener(
            'click',
            this.$current._clickHandler
          );
          delete this.$current._clickHandler;
        }
        delete this.$current._hasClickHandler;
      }

      // Очистка содержимого | Clean up content
      if (this.$content && this.$content.isConnected) {
        this.$content.classList.remove('prismium__content');
        if (this.$content.children && this.$content.children.length > 0) {
          Array.from(this.$content.children).forEach((child) => {
            if (child && child.isConnected) {
              const stylesToRemove = [
                'transform',
                'opacity',
                'transition',
                'transform-origin',
              ];
              stylesToRemove.forEach((style) =>
                child.style.removeProperty(style)
              );
            }
          });
        }
      }

      // Очистка иконок | Clean up icons
      if (this.$icons) {
        this.$icons.forEach((icon) => {
          if (icon && icon.isConnected) {
            icon.classList.remove('prismium__icon', 'prismium__icon_hidden');
            icon.removeEventListener('click', (e) => e.preventDefault());
          }
        });
      }

      // Очистка темы | Clean up theme
      if (this.el && this.options.theme) {
        const themeClass = `prismium_${this.options.theme}`;
        if (this.el.classList.contains(themeClass)) {
          this.el.classList.remove(themeClass);
        }
      }

      // Очистка менеджеров | Clean up managers
      if (this.timerManager) {
        this.timerManager.destroy();
        this.timerManager = null;
      }

      if (this.domManager) {
        this.domManager.cleanup();
        this.domManager = null;
      }

      this.iconManager = null;

      // Очистка модулей (без полного удаления) | Clean up modules (without full deletion)
      this.__modules__.forEach((module) => {
        if (typeof module.destroy === 'function') {
          module.destroy(this);
        }
      });

      // Очистка ссылок на DOM элементы (кроме this.el) | Clean up references to DOM elements (except this.el)
      this.$current = null;
      this.$content = null;
      this.$hidden = null;
      this.$container = null;
      this.$icons = null;
      this.$binding = null;
      this.icon = null;
      this.speed = null;

      this.initialized = false;
      this.destroyed = true;
      this.opened = false;

      this.options = savedState.options;
      this.__modules__ = savedState.__modules__;

      // Удаляем инстанс из хранилища | Remove instance from storage
      if (currentEl && PrismiumClass) {
        PrismiumClass.__instances__.delete(currentEl);
        this.el = currentEl;
      }

      this.emit('destroy');
    } catch (error) {
      console.error('Destroy error:', error);
      throw error;
    }

    this.emit('afterDestroy');

    return this;
  },
};
