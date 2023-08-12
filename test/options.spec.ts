import { expect } from "chai"

import { Options } from "./../src/"

describe("options.spec.ts / Options", () => {
  it("ENV:HCM_ADD_DEBUG_COMMAND => false", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = "false"
    const opts = new Options()
    expect(opts.addDebugCommand).to.eq(false)
  })

  it("ENV:HCM_ADD_DEBUG_COMMAND => true", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = "true"
    const opts = new Options()
    expect(opts.addDebugCommand).to.eq(true)
  })

  it("ENV:HCM_ADD_DEBUG_COMMAND => NULL", () => {
    process.env["HCM_ADD_DEBUG_COMMAND"] = ""
    const opts = new Options()
    expect(opts.addDebugCommand).to.eq(false)
  })
})
