import { RestParameter, RegExParameter } from "../../src/index"
import { expect } from "chai"

import { createRegex, test, exec } from "../_parameter-testing"

describe("RegExParameters.spec.ts", () => {
  describe("RegexParameter+RestParameter", () => {
    it("Capture name and description", () => {
      var p = [new RegExParameter("name", "[^ ]+"), new RestParameter("description", "")]

      var r = createRegex(p)

      expect(test(r, "hubot test cmd name-of-incident description of the incident")).to.eq(true)

      let result = exec(r, "hubot test cmd name-of-incident description of the incident")
      expect(result![1] == "name-of-incident")
      expect(result![2] == "description of the incident")
    })
  })
})
