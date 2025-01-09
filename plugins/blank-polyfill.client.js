export default defineNuxtPlugin(async () => {
  const cssBlankPseudoInit = (await import('css-blank-pseudo/browser')).default;
  cssBlankPseudoInit({ force: true });
});