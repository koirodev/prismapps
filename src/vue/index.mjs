import { Prismium } from './components/Prismium.mjs';
import { PrismiumCurrent } from './components/PrismiumCurrent.mjs';
import { PrismiumContent } from './components/PrismiumContent.mjs';

export { Prismium, PrismiumCurrent, PrismiumContent };

export default {
  install(app) {
    app.component("Prismium", Prismium);
    app.component("PrismiumCurrent", PrismiumCurrent);
    app.component("PrismiumContent", PrismiumContent);
  }
};
