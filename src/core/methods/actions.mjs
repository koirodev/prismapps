export default {
  open(el) {
    // Проверка, является ли el строкой, и если да, то получение элемента | Check if el is a string and get the element if it is
    if (typeof el === "string") {
      el = document.querySelector(el);
    }

    // Если элемент не найден, выход из функции | Exit the function if the element is not found
    if (!el) return;

    // Получаем именно тот экземпляр, который привязан к элементу | Get the exact instance that is bound to the element
    const instance = this.getInstance(el);
    if (!instance || instance.opened) return;

    instance.emit("beforeOpen");

    // Если есть менеджер эффектов и задан эффект, запускаем событие начала эффекта | If there is an effects manager and an effect is set, start the effect event
    if (instance.effectsManager && instance.options.effect) {
      instance.emit("effectStart", "open");
    }

    instance.opened = true;

    // Если у элемента есть дочерние элементы и открываются все элементы, добавляем классы | If the element has child elements and all elements are opened, add classes
    if (instance.hasChildren && (this._isOpeningAll || this._isOpeningEverything)) {
      el.classList.add(instance.options.activeClass);
      instance.$hidden.classList.add(instance.options.openedClass);

      this.iconManager?.updateIcon("open");

      this.emit("open");
      this.emit("afterOpen");
      return;
    }

    // Прокрутка к элементу, если задано в опциях | Scroll to the element if set in the options
    if (instance.options.scrollTo) {
      let startTime = null;
      const duration = instance.speed.open;

      // Функция для отмены анимации | Function to cancel animation
      const cancelFollow = () => {
      if (instance.__followAnimation) {
        cancelAnimationFrame(instance.__followAnimation);
        instance.__followAnimation = null;
      }
      };

      // Очищаем предыдущую анимацию если она есть | Clear the previous animation if it exists
      cancelFollow();

      // Обработчик прокрутки для отмены анимации | Scroll handler to cancel animation
      const scrollHandler = () => {
      cancelFollow();
      window.removeEventListener('scroll', scrollHandler);
      };
      window.addEventListener('scroll', scrollHandler);

      const followElement = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const elementRect = instance.$current.getBoundingClientRect();
      const offset = instance.options.scrollOffset || 0;

      window.scrollTo({
        top: window.scrollY + elementRect.top - offset,
        behavior: 'auto'
      });

      if (elapsed < duration) {
        instance.__followAnimation = requestAnimationFrame(followElement);
      } else {
        cancelFollow();
        window.removeEventListener('scroll', scrollHandler);
      }
      };

      instance.__followAnimation = requestAnimationFrame(followElement);

      // Очищаем анимацию при закрытии | Clear the animation when closing
      instance.__animationTimer = this.timerManager.setTimeout(() => {
      cancelFollow();
      window.removeEventListener('scroll', scrollHandler);
      }, instance.speed.open);
    }

    // Применение эффектов открытия, если они заданы | Apply opening effects if set
    if (instance.effectsManager && instance.options.effect) {
      instance.effectsManager.applyOpenEffects(instance);
    }

    // Установка максимальной высоты для анимации | Set the maximum height for the animation
    const height = instance.$binding.clientHeight || 0;
    instance.$hidden.style.maxHeight = `${height}px`;
    el.classList.add(instance.options.activeClass);

    // Очистка таймеров и установка новых для иконок и анимации | Clear timers and set new ones for icons and animations
    instance.__iconTimer && this.timerManager.clearTimeout(instance.__iconTimer);
    instance.__animationTimer && this.timerManager.clearTimeout(instance.__animationTimer);
    instance.__iconTimer = this.timerManager.setTimeout(() => {
      this.iconManager?.updateIcon("open");
      this.emit("open");
    }, instance.speed.open / 2);

    instance.__animationTimer = this.timerManager.setTimeout(() => {
      instance.$hidden.style.removeProperty("max-height");
      instance.$hidden.classList.add(instance.options.openedClass);

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

      this.emit("afterOpen");
    }, instance.speed.open);

    // Применение эффектов открытия и установка таймера для завершения эффекта | Apply opening effects and set a timer to finish the effect
    if (instance.effectsManager && instance.options.effect) {
      instance.effectsManager.applyOpenEffects(instance);
      const duration = instance.effectsManager.getEffectsDuration(instance);

      instance.__effectTimer && instance.timerManager.clearTimeout(instance.__effectTimer);
      instance.__effectTimer = instance.timerManager.setTimeout(() => {
        instance.emit("effectEnd", "open");
      }, duration);
    }
  },

  close(el) {
    // Проверка, является ли el строкой, и если да, то получение элемента | Check if el is a string and get the element if it is
    if (typeof el === "string") {
      el = document.querySelector(el);
    }

    // Если элемент не найден, выход из функции | Exit the function if the element is not found
    if (!el) return;

    // Получаем именно тот экземпляр, который привязан к элементу | Get the exact instance that is bound to the element
    const instance = this.getInstance(el);
    if (!instance || !instance.opened) return;

    instance.emit("beforeClose");

    // Если есть менеджер эффектов и задан эффект, запускаем событие начала эффекта | If there is an effects manager and an effect is set, start the effect event
    if (instance.effectsManager && instance.options.effect) {
      instance.emit("effectStart", "close");
    }

    instance.opened = false;

    // Закрытие всех дочерних элементов, если они есть | Close all child elements if they exist
    if (instance.hasChildren) {
      const nestedItems = el.querySelectorAll(`.${instance.options.activeClass}`);
      nestedItems.forEach(nested => this.close(nested));
    }

    // Применение эффектов закрытия, если они заданы | Apply closing effects if set
    if (instance.effectsManager && instance.options.effect) {
      instance.effectsManager.applyCloseEffects(instance);
    }

    // Установка максимальной высоты для анимации | Set the maximum height for the animation
    const height = instance.$binding.clientHeight;
    instance.$hidden.style.maxHeight = `${height}px`;

    instance.$hidden.classList.remove(instance.options.openedClass);
    el.classList.remove(instance.options.activeClass);

    // Очистка таймеров и установка новых для иконок и анимации | Clear timers and set new ones for icons and animations
    instance.__iconTimer && this.timerManager.clearTimeout(instance.__iconTimer);
    instance.__animationTimer && this.timerManager.clearTimeout(instance.__animationTimer);

    requestAnimationFrame(() => {
      instance.$hidden.style.maxHeight = "0px";

      // Применение эффектов закрытия, если они заданы | Apply closing effects if set
      if (instance.effectsManager && instance.options.effect) {
        instance.effectsManager.applyCloseEffects(instance);
      }

      setTimeout(() => {
        this.iconManager?.updateIcon("close");
        this.emit("close");
      }, instance.speed.close / 2);

      instance.__animationTimer = this.timerManager.setTimeout(() => {
        instance.$hidden.style.removeProperty("max-height");

        // Очистка стилей у дочерних элементов | Clear styles for child elements
        if (instance.$content) {
          Array.from(instance.$content.children).forEach(child => {
            child.style.removeProperty("transform");
            child.style.removeProperty("opacity");
            child.style.removeProperty("transition");
            child.style.removeProperty("transform-origin");
          });
        }

        // Завершение эффекта закрытия и запуск события после закрытия | Finish the closing effect and start the after closing event
        if (instance.effectsManager && instance.options.effect) {
          this.emit("effectEnd", "close");
        }
        this.emit("afterClose");
      }, instance.speed.close);
    });
  },
};
