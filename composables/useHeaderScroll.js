export default function () {
  const isHeaderHidden = ref(false);

  onMounted(() => {
    const header = document.querySelector(".header");
    if (!header) return

    const headerHeight = header.offsetHeight;
    const scrollThreshold = headerHeight / 1;
    let lastScrollY = window.scrollY;

    const hideHeader = () => {
      isHeaderHidden.value = true;
    };

    const showHeader = () => {
      isHeaderHidden.value = false;
    };

    const headerProcess = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY < headerHeight) {
        showHeader();
      }

      if (currentScrollY > lastScrollY && currentScrollY > headerHeight && !isHeaderHidden.value) {
        hideHeader();
      } else if (currentScrollY < lastScrollY && currentScrollY > headerHeight && isHeaderHidden.value) {
        showHeader();
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", headerProcess);

    onUnmounted(() => {
      window.removeEventListener("scroll", headerProcess);
    })
  })

  return {
    isHeaderHidden
  };
}
