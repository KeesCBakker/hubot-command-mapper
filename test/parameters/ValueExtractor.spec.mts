import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { RegExParameter, StringParameter } from "../../src/index.mjs"
import { getValues } from "../../src/entities/parameters/ValueExtractor.mjs"

describe("ValueExtractor / native named capture groups", () => {
  it("extracts parameters with nested groups and supplies omitted defaults", () => {
    const command = {
      name: "cmd",
      parameters: [new RegExParameter("code", "(foo|bar)-(\\d+)"), new StringParameter("label", "fallback")],
      execute: () => {},
    }
    const tool = { name: "test", commands: [command] }

    assert.deepEqual(getValues("hubot", "", tool, command, "@hubot test cmd foo-42"), {
      code: "foo-42",
      label: "fallback",
    })
    assert.deepEqual(getValues("hubot", "", tool, command, "@hubot test cmd bar-7 example"), {
      code: "bar-7",
      label: "example",
    })
  })
})
