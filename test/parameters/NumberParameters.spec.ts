import { expect } from "chai"

import { createToolRegex } from "./_parameter-testing"
import { NumberParameter, NumberStyle, FractionParameter } from "../../src"

describe("NumberParameters.param.spec.ts / Default commands", () => {
  describe("NumberParameter", () => {
    it("Single Parameter", () => {
      const p = new NumberParameter("a")
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd -10")).to.eql(true, "Negative number.")
      expect(r.test("hubot test cmd 1337")).to.eql(true, "Positive number.")
    })

    it("Positive Parameter", () => {
      const p = new NumberParameter("a", null, NumberStyle.Positive)
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd 10")).to.eql(true, "Positive number.")
      expect(r.test("hubot test cmd -10")).to.eql(false, "Negative number.")
    })

    it("Negative Parameter", () => {
      const p = new NumberParameter("a", null, NumberStyle.Negative)
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd 10")).to.eql(false, "Positive number.")
      expect(r.test("hubot test cmd -10")).to.eql(true, "Negative number.")
    })

    it("Double Parameter", () => {
      const p1 = new NumberParameter("a")
      const p2 = new NumberParameter("b")
      const r = createToolRegex([p1, p2])

      expect(r.test("hubot test cmd -10 1337")).to.eql(true, "Negative number followed by a positive number.")
      expect(r.test("hubot test cmd 1337 -10")).to.eql(true, "Positive number followed by a negative number.")
    })
  })

  describe("FractionParameter", () => {
    it("Single Parameter", () => {
      const p = new FractionParameter("a")
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd -10.144")).to.eql(true, "Negative number.")
      expect(r.test("hubot test cmd 1337.28")).to.eql(true, "Positive number.")
    })
  })
})
