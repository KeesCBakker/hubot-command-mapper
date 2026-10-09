import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { Options, mapper } from "../src/index.mjs"
import { TestBotContext, createTestBot } from "./common/test-bot.mjs"

describe("commands.spec.ts / Default commands", function () {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    var options = new Options()
    options.addDebugCommand = true
    options.addHelpCommand = true

    mapper(
      context.robot,
      {
        name: "test",
        commands: [
          {
            name: "dummy",
            execute: _ => {}
          }
        ]
      },
      options
    )
  })

  afterEach(() => context.robot.shutdown())

  it("Debug", async () => {
    let response = await context.sendAndWaitForResponse("@hubot test debug")
    assert.equal(response,
      'The tool "test" uses the following commands:\n' +
        "- dummy: ^@?hubot test( dummy)$\n" +
        "- debug: ^@?hubot test( debug)$\n" +
        "- help: ^@?hubot test( help| \\?| \\/\\?| \\-\\-help)$"
    )
  })

  it("Invalid command", async () => {
    let response = await context.sendAndWaitForResponse("@hubot test invalid")
    assert.equal(response, "invalid syntax.")
  })
})
