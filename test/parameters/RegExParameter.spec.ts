import { RestParameter, RegExParameter } from "../../src/index"
import { expect } from "chai"

import { createToolRegex } from "./_parameter-testing"

describe("RegExParameters.spec.ts", () => {
  describe("RegexParameter+RestParameter", () => {
    it("Capture name and description", () => {
      const p = [new RegExParameter("name", "[^ ]+"), new RestParameter("description", "")]

      const r = createToolRegex(p)

      expect(r.test("hubot test cmd name-of-incident description of the incident")).to.be.true

      const result = r.exec("hubot test cmd name-of-incident description of the incident")
      expect(result![1] == "name-of-incident")
      expect(result![2] == "description of the incident")
    })
  })
})
