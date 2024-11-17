import { expect } from "chai"
import { mapper } from "../src/index.mjs"


describe("package.spec.ts / Package", () => {
  it("index.js", () => {
    expect(mapper).to.be.not.null
    expect(mapper).to.be.a("function")
  })
})
