import { expect } from "chai"
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
    expect(response).eql(
      'The tool "test" uses the following commands:\n' +
        "- dummy: ^@?hubot test( dummy)$\n" +
        "- debug: ^@?hubot test( debug)$\n" +
        "- help: ^@?hubot test( help| \\?| \\/\\?| \\-\\-help)$"
    )
  })

  it("Invalid command", async () => {
    let response = await context.sendAndWaitForResponse("@hubot test invalid")
    expect(response).eql("invalid syntax.")
  })
})
