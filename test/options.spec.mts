import { expect } from "chai"
import { Options } from "../src/index.mjs"

describe("options.spec.ts / Options", () => {
  it("ENV:HCM_ADD_DEBUG_COMMAND => false", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = "false"
    var opts = new Options()
    expect(opts.addDebugCommand).to.eq(false)
  })

  it("ENV:HCM_ADD_DEBUG_COMMAND => true", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = "true"
    var opts = new Options()
    expect(opts.addDebugCommand).to.eq(true)
  })

  it("ENV:HCM_ADD_DEBUG_COMMAND => NULL", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = ""
    var opts = new Options()
    expect(opts.addDebugCommand).to.eq(false)
  })
})
