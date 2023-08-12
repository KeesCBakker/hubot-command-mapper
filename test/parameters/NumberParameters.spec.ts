import { expect } from "chai"

import { createRegex, test } from "../_parameter-testing"
import { NumberParameter, NumberStyle, FractionParameter } from "../../src"

describe("NumberParameters.param.spec.ts / Default commands", () => {
  describe("NumberParameter", () => {
    it("Single Parameter", () => {
      const p = new NumberParameter("a")
      const r = createRegex([p])

      expect(test(r, "hubot test cmd -10")).to.eq(true, "Negative number.")
      expect(test(r, "hubot test cmd 1337")).to.eq(true, "Positive number.")
    })

    it("Positive Parameter", () => {
      const p = new NumberParameter("a", null, NumberStyle.Positive)
      const r = createRegex([p])

      expect(test(r, "hubot test cmd 10")).to.eq(true, "Positive number.")
      expect(test(r, "hubot test cmd -10")).to.eq(false, "Negative number.")
    })

    it("Negative Parameter", () => {
      const p = new NumberParameter("a", null, NumberStyle.Negative)
      const r = createRegex([p])

      expect(test(r, "hubot test cmd 10")).to.eq(false, "Positive number.")
      expect(test(r, "hubot test cmd -10")).to.eq(true, "Negative number.")
    })

    it("Double Parameter", () => {
      const p1 = new NumberParameter("a")
      const p2 = new NumberParameter("b")
      const r = createRegex([p1, p2])

      expect(test(r, "hubot test cmd -10 1337")).to.eq(true, "Negative number followed by a positive number.")
      expect(test(r, "hubot test cmd 1337 -10")).to.eq(true, "Positive number followed by a negative number.")
    })
  })

  describe("FractionParameter", () => {
    it("Single Parameter", () => {
      const p = new FractionParameter("a")
      const r = createRegex([p])

      expect(test(r, "hubot test cmd -10.144")).to.eq(true, "Negative number.")
      expect(test(r, "hubot test cmd 1337.28")).to.eq(true, "Positive number.")
    })
  })
})
