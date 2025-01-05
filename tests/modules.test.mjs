import assert from "assert";
import Prismium from "../src/prismium-ui.mjs";

describe("Modules", () => {
  it("должен корректно регистрировать модуль", () => {
    const testModule = { name: "test-module" };
    Prismium.use(testModule);
    assert.ok(Prismium.__modules__.has("test-module"));
  });

  it("должен выбрасывать ошибку для некорректного модуля", () => {
    assert.throws(() => {
      Prismium.use({});
    }, /Module must have a name/);
  });

  it("должен корректно регистрировать несколько модулей", () => {
    const module1 = { name: "module-1" };
    const module2 = { name: "module-2" };
    Prismium.use([module1, module2]);
    assert.ok(Prismium.__modules__.has("module-1"));
    assert.ok(Prismium.__modules__.has("module-2"));
  });

  it("должен выбрасывать ошибку для некорректного массива модулей", () => {
    assert.throws(() => {
      Prismium.use([{}, { name: "valid-module" }]);
    }, /Module must have a name/);
  });
});
