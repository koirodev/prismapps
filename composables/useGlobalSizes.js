export const useGlobalSizes = () => {
  const setGlobalHeaderHeight = () => {
    if (document.querySelector(".header")) {
      const header = document.querySelector(".header");
      document.body.style.setProperty(
        "--global-header-height",
        `${header.clientHeight}px`
      );
    }
  };

  const setGlobalBreadcrumbsHeight = () => {
    if (document.querySelector(".breadcrumbs")) {
      const breadcrumbs = document.querySelector(".breadcrumbs");
      document.body.style.setProperty(
        "--global-breadcrumbs-height",
        `${breadcrumbs.clientHeight}px`
      );
    }
  };

  const setGlobalDVHDiff = () => {
    let a, b;
    document.body.style.setProperty("height", "100dvh");
    a = startSize = document.body.clientHeight;
    document.body.style.setProperty("height", "100vh");
    b = endSize = document.body.clientHeight;
    document.body.style.removeProperty("height");

    const diff = b - a;
    document.body.style[diff > -1 ? "setProperty" : "removeProperty"]("--global-dvh-diff", `${diff}px`);
  };

  function resetDVHDiff(lastWidth) {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      setGlobalDVHDiff();
    }
  }

  const updateSizes = (lastWidth) => {
    setGlobalHeaderHeight();
    setGlobalBreadcrumbsHeight();
    resetDVHDiff(lastWidth);
  };

  onMounted(() => {
    let lastWidth = window.innerWidth;
    
    updateSizes(lastWidth);
    setGlobalDVHDiff();

    const handleResize = () => updateSizes(lastWidth);
    window.addEventListener("resize", handleResize);

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  return {
    updateSizes
  };
};
