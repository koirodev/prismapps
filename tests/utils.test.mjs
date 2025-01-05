import assert from "assert";
import { deepMerge } from "../src/utils/deepMerge.mjs";
import { deleteProps } from "../src/utils/deleteProps.mjs";

describe("Utils", () => {
  describe("deepMerge", () => {
    it("должен корректно объединять два объекта", () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const result = deepMerge(obj1, obj2);
      assert.deepStrictEqual(result, { a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it("должен корректно объединять массивы", () => {
      const obj1 = { a: [1, 2, 3] };
      const obj2 = { a: [4, 5] };
      const result = deepMerge(obj1, obj2);
      assert.deepStrictEqual(result, { a: [4, 5] });
    });

    it("должен корректно объединять вложенные объекты", () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { d: 2 } } };
      const result = deepMerge(obj1, obj2);
      assert.deepStrictEqual(result, { a: { b: { c: 1, d: 2 } } });
    });

    it("должен корректно объединять объекты с массивами", () => {
      const obj1 = { a: { b: [1, 2] } };
      const obj2 = { a: { b: [3, 4] } };
      const result = deepMerge(obj1, obj2);
      assert.deepStrictEqual(result, { a: { b: [3, 4] } });
    });

    it("должен корректно объединять объекты с примитивными значениями", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge(obj1, obj2);
      assert.deepStrictEqual(result, { a: 1, b: 3, c: 4 });
    });
  });
});
