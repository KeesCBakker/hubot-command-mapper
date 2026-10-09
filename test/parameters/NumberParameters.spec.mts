import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { NumberParameter, NumberStyle, FractionParameter } from "../../src/index.mjs"
import { createRegex, test } from "../_parameter-testing.mjs"

describe("NumberParameters.param.spec.ts / Default commands", () => {
  describe("NumberParameter", () => {
    it("Single Parameter", () => {
      var p = new NumberParameter("a")
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd -10"), true, "Negative number.")
      assert.equal(test(r, "hubot test cmd 1337"), true, "Positive number.")
    })

    it("Positive Parameter", () => {
      var p = new NumberParameter("a", null, NumberStyle.Positive)
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd 10"), true, "Positive number.")
      assert.equal(test(r, "hubot test cmd -10"), false, "Negative number.")
    })

    it("Negative Parameter", () => {
      var p = new NumberParameter("a", null, NumberStyle.Negative)
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd 10"), false, "Positive number.")
      assert.equal(test(r, "hubot test cmd -10"), true, "Negative number.")
    })

    it("Double Parameter", () => {
      var p1 = new NumberParameter("a")
      var p2 = new NumberParameter("b")
      var r = createRegex([p1, p2])

      assert.equal(test(r, "hubot test cmd -10 1337"), true, "Negative number followed by a positive number.")
      assert.equal(test(r, "hubot test cmd 1337 -10"), true, "Positive number followed by a negative number.")
    })
  })

  describe("FractionParameter", () => {
    it("Single Parameter", () => {
      var p = new FractionParameter("a")
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd -10.144"), true, "Negative number.")
      assert.equal(test(r, "hubot test cmd 1337.28"), true, "Positive number.")
    })
  })
})
