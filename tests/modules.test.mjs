import assert from "assert";
import Prismium from "../src/prismium-ui.mjs";

describe("Modules", () => {
  it("should register the module correctly", () => {
    const testModule = { name: "test-module" };
    Prismium.use(testModule);
    assert.ok(Prismium.__modules__.has("test-module"));
  });

  it("should throw an error for an invalid module", () => {
    assert.throws(() => {
      Prismium.use({});
    }, /Module must have a name/);
  });

  it("should register multiple modules correctly", () => {
    const module1 = { name: "module-1" };
    const module2 = { name: "module-2" };
    Prismium.use([module1, module2]);
    assert.ok(Prismium.__modules__.has("module-1"));
    assert.ok(Prismium.__modules__.has("module-2"));
  });

  it("should throw an error for invalid array of modules", () => {
    assert.throws(() => {
      Prismium.use([{}, { name: "valid-module" }]);
    }, /Module must have a name/);
  });
});
