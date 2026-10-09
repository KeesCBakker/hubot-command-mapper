import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { RegExParameter, RestParameter } from "../../src/index.mjs"
import { createRegex, exec, test } from "../_parameter-testing.mjs"

describe("RegExParameters.spec.ts", () => {
  describe("RegexParameter+RestParameter", () => {
    it("Capture name and description", () => {
      var p = [new RegExParameter("name", "[^ ]+"), new RestParameter("description", "")]

      var r = createRegex(p)

      assert.equal(test(r, "hubot test cmd name-of-incident description of the incident"), true)

      let result = exec(r, "hubot test cmd name-of-incident description of the incident")
      assert.ok(result)
      assert.ok(result.includes("name-of-incident"))
      assert.ok(result.includes("description of the incident"))
    })
  })
})
