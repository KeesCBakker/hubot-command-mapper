import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { mapper } from "../src/index.mjs"

describe("package.spec.ts / Package", () => {
  it("index.js", () => {
    assert.notEqual(mapper, null)
    assert.equal(typeof mapper, "function")
  })
})
