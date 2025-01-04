// Получить текущее время | Get current time
function now() {
  return Date.now();
}

// Обработка аккордеонов | Process accordions
function processAccordions(nestedAccordions, rootAccordions, getInstance, open) {
  // Открываем вложенные мгновенно | Open nested accordions instantly
  nestedAccordions.forEach(el => {
    const instance = getInstance(el);
    if (instance) {
      // Сохраняем оригинальную скорость | Save original speed
      const originalSpeed = { ...instance.speed };

      // Устанавливаем нулевую скорость | Set zero speed
      el.style.setProperty("--prismium-speed", "0ms");

      // Открываем аккордеон | Open accordion
      open(el);
      instance.iconManager?.updateIcon("open");

      // Сразу восстанавливаем скорость | Restore speed immediately
      requestAnimationFrame(() => {
        instance.speed = originalSpeed;
        el.style.setProperty("--prismium-speed", `${originalSpeed.open}ms`);
      });
    }
  });

  // Открываем корневые с анимацией | Open root accordions with animation
  rootAccordions.forEach(el => {
    const instance = getInstance(el);
    if (instance) {
      open(el);
      instance.iconManager?.updateIcon("open");
    }
  });
}

// Получить глубину элемента | Get element depth
function getElementDepth(el, container) {
  let depth = 0;
  let current = el;

  while (current && current !== container && current !== document.body) {
    current = current.parentElement;
    if (current && current.matches(".prismium")) {
      depth++;
    }
  }

  return depth;
}

export { now, processAccordions, getElementDepth };
