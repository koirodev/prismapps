import assert from 'assert';
import Prismium from '../src/prismium-core.mjs';

import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Prismium Core', () => {
  let prismium;
  let document;
  let window;

  beforeEach(() => {
    const html = readFileSync(join(__dirname, './fixtures/index.html'), 'utf8');
    const dom = new JSDOM(html);
    window = dom.window;
    document = window.document;
    global.document = document;
    global.Element = window.Element;
    global.requestAnimationFrame = window.requestAnimationFrame || function (callback) {
      return setTimeout(callback, 0);
    };
    prismium = new Prismium('[data-prismium]');
  });

  describe('Instance methods', () => {
    it('should be initialized with default settings', () => {
      assert.ok(prismium);
    });

    it('must be destroyed correctly', () => {
      prismium.destroy();
      assert.ok(prismium.destroyed);
      assert.ok(!prismium.initialized);
      assert.ok(!prismium.opened);
      assert.strictEqual(prismium.$current, null);
      assert.strictEqual(prismium.$content, null);
      assert.strictEqual(prismium.$hidden, null);
      assert.strictEqual(prismium.$container, null);
      assert.strictEqual(prismium.$icons, null);
      assert.strictEqual(prismium.$binding, null);
      assert.strictEqual(prismium.icon, null);
      assert.strictEqual(prismium.speed, null);
    });

    it('should open and close correctly', () => {
      const el = document.querySelector('[data-prismium]');
      prismium.open(el);
      assert.ok(prismium.opened);
      prismium.close(el);
      assert.ok(!prismium.opened);
    });

    it('must be mounted correctly', () => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div data-prismium-current></div>
        <div data-prismium-content></div>
      `;
      prismium.mount(el);
      assert.ok(prismium.initialized);
      assert.strictEqual(prismium.el, el);
      assert.ok(prismium.$current);
      assert.ok(prismium.$content);
      assert.ok(prismium.$hidden);
    });

    it('should throw an error when mounted without an element', () => {
      assert.throws(() => {
        prismium.mount(null);
      }, /Element is required/);
    });

    it('should throw an error when mounted with an invalid element', () => {
      assert.throws(() => {
        prismium.mount({});
      }, /Invalid element type/);
    });

    it('must be initialized with { init: false }', (done) => {
      try {
        const el = document.createElement('div');
        el.innerHTML = `
          <div data-prismium-current></div>
          <div data-prismium-content></div>
        `;
        document.body.appendChild(el);
        const newPrismium = new Prismium(el, { init: false });

        newPrismium.on('afterInit', () => {
          try {
            assert.ok(newPrismium.initialized);
            done();
          } catch (error) {
            done(error);
          }
        });

        newPrismium.init();
      } catch (error) {
        done(error);
      }
    });

    it('should set the speed correctly', () => {
      prismium.setupSpeed();
      assert.deepStrictEqual(prismium.speed, {
        open: 350,
        close: 350
      });
    });

    it('should return an instance correctly', () => {
      const el = document.createElement('div');
      el.__prismiumInstance__ = prismium;
      assert.strictEqual(prismium.getInstance(el), prismium);
    });

    it('should bind events correctly', () => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div data-prismium-current></div>
        <div data-prismium-content></div>
      `;
      prismium.bindEvents(el);
      assert.ok(prismium.$current._clickHandler);
    });

    it('should handle opening correctly', (done) => {
      try {
        const el = document.createElement('div');
        el.innerHTML = `
          <div data-prismium-current></div>
          <div data-prismium-content></div>
        `;
        document.body.appendChild(el);
        const newPrismium = new Prismium(el);

        newPrismium.on('afterOpen', () => {
          try {
            assert.ok(el.classList.contains('js-prismium-active'));
            assert.ok(newPrismium.opened);
            done();
          } catch (error) {
            done(error);
          }
        });

        newPrismium.open(el);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('should handle closing correctly', (done) => {
      try {
        const el = document.createElement('div');
        el.innerHTML = `
          <div data-prismium-current></div>
          <div data-prismium-content></div>
        `;
        document.body.appendChild(el);
        const newPrismium = new Prismium(el);

        const containerDiv = document.createElement('div');
        containerDiv.setAttribute('data-prismium-container', '');
        el.appendChild(containerDiv);

        newPrismium.close(el);

        newPrismium.on('afterClose', () => {
          try {
            assert.ok(!el.classList.contains('js-prismium-active'));
            assert.ok(!newPrismium.opened);
            done();
          } catch (error) {
            done(error);
          }
        });

        newPrismium.close(el);
        done();
      } catch (error) {
        done(error);
      }
    });

    it('should switch state correctly', (done) => {
      try {
        const el = document.createElement('div');
        el.innerHTML = `
          <div data-prismium-current></div>
          <div data-prismium-content></div>
        `;
        document.body.appendChild(el);
        const newPrismium = new Prismium(el);

        const containerDiv = document.createElement('div');
        containerDiv.setAttribute('data-prismium-container', '');
        el.appendChild(containerDiv);

        newPrismium.on('afterOpen', () => {
          try {
            assert.ok(el.classList.contains('js-prismium-active'));
            assert.ok(newPrismium.opened);

            newPrismium.on('afterClose', () => {
              try {
                assert.ok(!el.classList.contains('js-prismium-active'));
                assert.ok(!newPrismium.opened);
                done();
              } catch (error) {
                done(error);
              }
            });

            newPrismium.toggle(el);
          } catch (error) {
            done(error);
          }
        });

        newPrismium.toggle(el);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
