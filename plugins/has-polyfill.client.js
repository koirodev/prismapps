export default defineNuxtPlugin(async () => {
  const cssHasPseudo = (await import('css-has-pseudo/browser')).default;
  cssHasPseudo(document, { forcePolyfill: false, hover: true });
});