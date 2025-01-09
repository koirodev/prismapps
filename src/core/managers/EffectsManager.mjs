export class EffectsManager {
  // Применение эффекта | Apply effect
  #applyEffect(instance, isOpening) {
    if (!instance.$content) return;

    const effectMap = {
      "line-by-line": this.#applyLineByLineEffect,
      "fade-scale": this.#applyFadeScaleEffect,
      "slide": this.#applySlideEffect,
      "stagger": this.#applyStaggerEffect,
      "wave": this.#applyWaveEffect,
      "flip": this.#applyFlipEffect,
      "zoom": this.#applyZoomEffect,
      "cascade": this.#applyCascadeEffect,
      "custom": this.#applyCustomEffect,
    };

    const effect = effectMap[instance.options.effect];
    effect?.call(this, instance, isOpening);
  }

  // Применение эффектов при открытии | Apply open effects
  applyOpenEffects(instance) {
    this.#applyEffect(instance, true);
  }

  // Применение эффектов при закрытии | Apply close effects
  applyCloseEffects(instance) {
    this.#applyEffect(instance, false);
  }

  // Получение отфильтрованных дочерних элементов | Get filtered children
  #getFilteredChildren(instance) {
    const selectors = Array.isArray(instance.options.effectIgnore)
      ? instance.options.effectIgnore
      : [instance.options.effectIgnore];

    return Array.from(instance.$content.children).filter(child =>
      !selectors.some(selector =>
        selector && child.matches(selector)
      )
    );
  }

  // Применение эффекта "line-by-line" | Apply "line-by-line" effect
  #applyLineByLineEffect(instance, isOpening) {
    const defaults = {
      speed: 350,
      easing: "cubic-bezier(.25,.1,.25,1)",
      delay: 30,
      scale: 0.95,
      y: 30,
      x: 0,
      opacity: 0
    };

    const options = { ...defaults, ...instance.options.effectLineByLine };
    const children = this.#getFilteredChildren(instance);

    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.y === "Number") options.y = `${options.y}px`;
    if (typeof options.x === "Number") options.x = `${options.y}px`;

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    if (isOpening) {
      // Настраиваем начальное состояние | Setup initial state
      children.forEach(child => {
        child.style.transform = `translate(${options.x}, ${options.y}) scale(${options.scale})`;
        child.style.opacity = options.opacity;
      });

      // Запускаем анимацию с задержкой | Start animation with delay
      requestAnimationFrame(() => {
        children.forEach((child, i) => {
          child.style.transition =
            `transform ${options.speed}ms ${options.easing}, 
             opacity ${options.speed}ms ${options.easing}`;
          child.style.transitionDelay = `${options.delay * i}ms`;
          child.style.transform = "translate(0,0) scale(1)";
          child.style.opacity = "1";
        });
      });
    } else {
      // Анимация закрытия | Closing animation
      children.forEach((child, i) => {
        const reverseIndex = children.length - 1 - i;
        child.style.transition =
          `transform ${options.speed}ms ${options.easing}, 
           opacity ${options.speed}ms ${options.easing}`;
        child.style.transitionDelay = `${options.delay * reverseIndex}ms`;
        child.style.transform = `translate(${options.x}, ${options.y}) scale(${options.scale})`;
        child.style.opacity = options.opacity;
      });
    }

    // Очистка стилей после завершения | Cleanup styles after animation
    const maxDelay = options.delay * (children.length - 1) + options.speed;

    // Очищаем предыдущий таймер если есть | Clear previous timer if exists
    instance.__cleanupTimer && instance.timerManager.clearTimeout(instance.__cleanupTimer);

    // Устанавливаем новый таймер | Set new timer
    instance.__cleanupTimer = instance.timerManager.setTimeout(() => {
      children.forEach(child => {
        child.style.transition = "";
        if (isOpening) {
          child.style.transform = "";
          child.style.opacity = "";
        }
      });
    }, maxDelay);
  }

  // Применение эффекта "fade-scale" | Apply "fade-scale" effect
  #applyFadeScaleEffect(instance, isOpening) {
    const options = {
      speed: 400,
      easing: "cubic-bezier(.25,.1,.25,1)",
      scale: 0.9,
      opacity: 0
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;

    // Сбрасываем стили перед анимацией | Reset styles before animation
    children.forEach(child => {
      child.style.transition = "none";
      child.style.transform = isOpening ? `scale(${options.scale})` : "scale(1)";
      child.style.opacity = isOpening ? options.opacity : "1";
    });

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    children.forEach(child => {
      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms ${options.easing}`;

      if (isOpening) {
        requestAnimationFrame(() => {
          child.style.transform = "scale(1)";
          child.style.opacity = "1";
        });
      } else {
        requestAnimationFrame(() => {
          child.style.transform = `scale(${options.scale})`;
          child.style.opacity = options.opacity;
        });
      }
    });
  }

  // Применение эффекта "slide" | Apply "slide" effect
  #applySlideEffect(instance, isOpening) {
    const defaults = {
      speed: 400,
      easing: "cubic-bezier(.25,.1,.25,1)",
      direction: "up",
      distance: 30,
      opacity: 0
    };

    const options = { ...defaults, ...instance.options.effectSlide };
    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.distance === "Number") options.distance = `${options.distance}px`;

    // Определяем трансформацию в зависимости от направления | Define transform based on direction
    const getTransform = (direction, distance) => {
      switch (direction) {
        case "up": return `translateY(${distance})`;
        case "down": return `translateY(-${distance})`;
        case "left": return `translateX(${distance})`;
        case "right": return `translateX(-${distance})`;
        default: return `translateY(${distance})`;
      }
    };

    // Сбрасываем стили перед анимацией | Reset styles before animation
    children.forEach(child => {
      child.style.transition = "none";
      child.style.transform = isOpening ? getTransform(options.direction, options.distance) : "translate(0)";
      child.style.opacity = isOpening ? options.opacity : "1";
    });

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    children.forEach(child => {
      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms ${options.easing}`;

      if (isOpening) {
        requestAnimationFrame(() => {
          child.style.transform = "translate(0)";
          child.style.opacity = "1";
        });
      } else {
        requestAnimationFrame(() => {
          child.style.transform = getTransform(options.direction, options.distance);
          child.style.opacity = options.opacity;
        });
      }
    });
  }

  // Применение эффекта "stagger" | Apply "stagger" effect
  #applyStaggerEffect(instance, isOpening) {
    const options = {
      speed: 400,
      easing: "cubic-bezier(.25,.1,.25,1)",
      delay: 50,
      directions: ["up", "right", "down", "left"],
      distance: 30,
      opacity: 0
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.distance === "Number") options.distance = `${options.distance}px`;

    // Сбрасываем стили перед анимацией | Reset styles before animation
    children.forEach((child, i) => {
      const direction = options.directions[i % options.directions.length];
      let transform;

      switch (direction) {
        case "up": transform = `translateY(${options.distance})`; break;
        case "right": transform = `translateX(-${options.distance})`; break;
        case "down": transform = `translateY(-${options.distance})`; break;
        case "left": transform = `translateX(${options.distance})`; break;
      }

      child.style.transition = "none";
      child.style.transform = isOpening ? transform : "translate(0)";
      child.style.opacity = isOpening ? options.opacity : "1";
    });

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    children.forEach((child, i) => {
      const direction = options.directions[i % options.directions.length];
      let transform;

      switch (direction) {
        case "up": transform = `translateY(${options.distance})`; break;
        case "right": transform = `translateX(-${options.distance})`; break;
        case "down": transform = `translateY(-${options.distance})`; break;
        case "left": transform = `translateX(${options.distance})`; break;
      }

      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms ${options.easing}`;
      child.style.transitionDelay = `${options.delay * i}ms`;

      if (isOpening) {
        requestAnimationFrame(() => {
          child.style.transform = "translate(0)";
          child.style.opacity = "1";
        });
      } else {
        requestAnimationFrame(() => {
          child.style.transform = transform;
          child.style.opacity = options.opacity;
        });
      }
    });
  }

  // Применение эффекта "wave" | Apply "wave" effect
  #applyWaveEffect(instance, isOpening) {
    const options = {
      speed: 400,
      easing: "cubic-bezier(.25,.1,.25,1)",
      delay: 30,
      amplitude: 20,
      frequency: 2,
      opacity: 0
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.amplitude === "Number") options.amplitude = `${options.amplitude}px`;

    // Сбрасываем стили перед анимацией | Reset styles before animation
    children.forEach((child, i) => {
      const phase = (i / children.length) * Math.PI * options.frequency;
      const y = Math.sin(phase) * parseInt(options.amplitude);

      child.style.transition = "none";
      child.style.transform = isOpening ? `translateY(${y}px)` : "translateY(0)";
      child.style.opacity = isOpening ? options.opacity : "1";
    });

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    children.forEach((child, i) => {
      const phase = (i / children.length) * Math.PI * options.frequency;
      const y = Math.sin(phase) * parseInt(options.amplitude);

      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms ${options.easing}`;
      child.style.transitionDelay = `${options.delay * i}ms`;

      if (isOpening) {
        requestAnimationFrame(() => {
          child.style.transform = "translateY(0)";
          child.style.opacity = "1";
        });
      } else {
        requestAnimationFrame(() => {
          child.style.transform = `translateY(${y}px)`;
          child.style.opacity = options.opacity;
        });
      }
    });
  }

  // Применение эффекта "flip" | Apply "flip" effect
  #applyFlipEffect(instance, isOpening) {
    const options = {
      speed: 600,
      easing: "cubic-bezier(.25,.1,.25,1)",
      delay: 50,
      perspective: 1000,
      rotation: 90,
      opacity: 0
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.perspective === "Number") options.perspective = `${options.perspective}px`;

    instance.$content.style.perspective = options.perspective;

    // Сбрасываем стили перед анимацией | Reset styles before animation
    children.forEach((child, i) => {
      child.style.transition = "none";
      child.style.transform = isOpening ? `rotateX(${options.rotation}deg)` : "rotateX(0)";
      child.style.opacity = isOpening ? options.opacity : "1";
    });

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    children.forEach((child, i) => {
      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms ${options.easing}`;
      child.style.transitionDelay = `${options.delay * i}ms`;

      if (isOpening) {
        requestAnimationFrame(() => {
          child.style.transform = "rotateX(0)";
          child.style.opacity = "1";
        });
      } else {
        requestAnimationFrame(() => {
          child.style.transform = `rotateX(${options.rotation}deg)`;
          child.style.opacity = options.opacity;
        });
      }
    });
  }

  // Применение эффекта "zoom" | Apply "zoom" effect
  #applyZoomEffect(instance, isOpening) {
    const options = {
      speed: 500,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      delay: 50,
      scale: 0.1,
      opacity: 0,
      origins: ["top left", "top right", "bottom left", "bottom right", "center"]
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;

    children.forEach((child, i) => {
      const origin = options.origins[i % options.origins.length];
      child.style.transition = "none";
      child.style.transformOrigin = origin;

      if (isOpening) {
        child.style.transform = `scale(${options.scale})`;
        child.style.opacity = options.opacity;
      }
    });

    instance.$content.offsetHeight;

    children.forEach((child, i) => {
      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      child.style.transitionDelay = `${options.delay * i}ms`;

      if (isOpening) {
        child.style.transform = "scale(1)";
        child.style.opacity = "1";
      } else {
        child.style.transform = `scale(${options.scale})`;
        child.style.opacity = options.opacity;
      }
    });
  }

  // Применение эффекта "cascade" | Apply "cascade" effect
  #applyCascadeEffect(instance, isOpening) {
    const options = {
      speed: 600,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      delay: 100,
      rotation: 15,
      distance: 50,
      opacity: 0
    };

    const children = this.#getFilteredChildren(instance);
    if (!children.length) return;
    
    // Обрабатываем options | Process options
    if (typeof options.distance === "Number") options.distance = `${options.distance}px`;

    children.forEach((child, i) => {
      child.style.transition = "none";
      const rotation = (i % 2 === 0 ? 1 : -1) * options.rotation;

      if (isOpening) {
        child.style.transform = `translateY(${options.distance}) rotate(${rotation}deg)`;
        child.style.opacity = options.opacity;
      }
    });

    instance.$content.offsetHeight;

    children.forEach((child, i) => {
      child.style.transition = `transform ${options.speed}ms ${options.easing}, 
                              opacity ${options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      child.style.transitionDelay = `${options.delay * i}ms`;

      if (isOpening) {
        child.style.transform = "translateY(0) rotate(0)";
        child.style.opacity = "1";
      } else {
        const rotation = (i % 2 === 0 ? 1 : -1) * options.rotation;
        child.style.transform = `translateY(${options.distance}) rotate(${rotation}deg)`;
        child.style.opacity = options.opacity;
      }
    });
  }

  // Применение кастомного эффекта | Apply custom effect
  #applyCustomEffect(instance, isOpening) {
    const defaults = {
      speed: 400,
      easing: "cubic-bezier(.25,.1,.25,1)",
      delay: 50,
      setup: null,
      open: null,
      close: null,
      cleanup: null
    };

    const options = { ...defaults, ...instance.options.effectCustom };
    const children = this.#getFilteredChildren(instance);

    if (!children.length) return;

    // Применяем начальную настройку если есть | Apply setup if exists
    if (typeof options.setup === "function") {
      children.forEach((child, i) => {
        options.setup(child, i, children.length, isOpening);
      });
    }

    // Форсируем reflow | Force reflow
    instance.$content.offsetHeight;

    // Применяем анимацию | Apply animation
    children.forEach((child, i) => {
      const animate = isOpening ? options.open : options.close;
      if (typeof animate === "function") {
        requestAnimationFrame(() => {
          animate(child, i, children.length);
        });
      }
    });

    // Очистка после анимации | Cleanup after animation
    if (typeof options.cleanup === "function") {
      const maxDelay = options.delay * (children.length - 1) + options.speed;

      instance.__cleanupTimer && instance.timerManager.clearTimeout(instance.__cleanupTimer);
      instance.__cleanupTimer = instance.timerManager.setTimeout(() => {
        children.forEach((child, i) => {
          options.cleanup(child, i, children.length, isOpening);
        });
      }, maxDelay);
    }
  }

  // Получение длительности эффектов | Get effects duration
  getEffectsDuration(instance) {
    if (!instance.$content || !instance.options.effect) return 0;

    const children = this.#getFilteredChildren(instance);
    const lastIndex = children.length - 1;

    switch (instance.options.effect) {
      case "line-by-line":
        return (instance.options.effectLineByLine?.delay || 30) * lastIndex +
          (instance.options.effectLineByLine?.speed || 350);
      case "stagger":
        return (instance.options.effectStagger?.delay || 50) * lastIndex + 400;
      case "wave":
        return (instance.options.effectWave?.delay || 30) * lastIndex + 400;
      case "flip":
        return (instance.options.effectFlip?.delay || 50) * lastIndex + 600;
      case "slide":
      case "slide-up":
        return (instance.options.effectSlide?.speed || 400);
      case "fade-scale":
        return 400;
      case "zoom":
        return (instance.options.effectZoom?.delay || 50) * lastIndex + 500;
      case "cascade":
        return (instance.options.effectCascade?.delay || 100) * lastIndex + 600;
      case "custom":
        const options = { ...instance.options.effectCustom };
        return (options.delay || 50) * lastIndex + (options.speed || 400);
      default:
        return 0;
    }
  }
}
