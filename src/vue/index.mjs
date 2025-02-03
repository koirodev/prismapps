import Prismium from '../core/core.mjs';
import PrismiumComponent from './components/Prismium.mjs';
import PrismiumCurrent from './components/PrismiumCurrent.mjs';
import PrismiumContent from './components/PrismiumContent.mjs';

export const createPrismium = (options = {}) => {
    const prismium = new Prismium(options);
    
    return {
        install(app) {
            app.config.globalProperties.$prismium = prismium;
            app.component('Prismium', PrismiumComponent);
            app.component('PrismiumCurrent', PrismiumCurrent);
            app.component('PrismiumContent', PrismiumContent);
        }
    };
};

export default {
  install(app) {
    app.component("Prismium", PrismiumComponent);
    app.component("PrismiumCurrent", PrismiumCurrent);
    app.component("PrismiumContent", PrismiumContent);
  }
};

export { PrismiumComponent, PrismiumCurrent, PrismiumContent };
export { default as Prismium } from '../core/core.mjs';
