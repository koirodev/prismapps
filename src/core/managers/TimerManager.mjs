export class TimerManager {
  constructor() {
    this.#timers = new Set();
  }

  #timers;

  // Установка таймера | Set timeout
  setTimeout(callback, delay) {
    const timer = setTimeout(() => {
      this.#timers.delete(timer);
      callback();
    }, delay);
    
    this.#timers.add(timer);
    return timer;
  }

  // Очистка таймера | Clear timeout
  clearTimeout(timer) {
    if (timer) {
      clearTimeout(timer);
      this.#timers.delete(timer);
    }
  }

  // Очистка всех таймеров | Clear all timers
  clearAll() {
    this.#timers.forEach(timer => {
      clearTimeout(timer);
    });
    this.#timers.clear();
  }

  // Уничтожение менеджера таймеров | Destroy timer manager
  destroy() {
    this.clearAll();
    this.#timers = null;
  }
}
