export default {
  init: true,
  theme: 'clear',
  speed: 350,
  autoClose: false,
  autoCloseNested: false,
  getParentHeight: false,
  scrollTo: false,
  spritePath: 'sprite.svg',

  // NS
  iconAttribute: 'data-prismium-icon',
  containerSelectors: ['[data-prismium-container]', '.section'],
  currentSelector: '[data-prismium-current]',
  contentSelector: '[data-prismium-content]',
  hiddenSelector: '[data-prismium-hidden]',

  // Classes
  hiddenClass: 'js-prismium-hidden',
  activeClass: 'js-prismium-active',
  openedClass: 'js-prismium-opened',
  disabledClass: 'js-prismium-disabled',
};
