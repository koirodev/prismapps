export const useGlobalSizes = () => {
  const setGlobalHeaderHeight = () => {
    if (document.querySelector(".header")) {
      const header = document.querySelector(".header");
      document.documentElement.style.setProperty(
        "--global-header-height",
        `${header.clientHeight}px`
      );
    }
  };

  const setGlobalBreadcrumbsHeight = () => {
    if (document.querySelector(".breadcrumbs")) {
      const breadcrumbs = document.querySelector(".breadcrumbs");
      document.documentElement.style.setProperty(
        "--global-breadcrumbs-height",
        `${breadcrumbs.clientHeight}px`
      );
    }
  };

  const updateSizes = () => {
    setGlobalHeaderHeight();
    setGlobalBreadcrumbsHeight();
  };

  onMounted(() => {
    updateSizes();
    window.addEventListener("resize", updateSizes);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSizes);
  });

  return {
    updateSizes
  };
};
