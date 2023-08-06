import { createTestBot, TestBotContext } from "../common/test-bot"
import { expect } from "chai"
import { map_command, map_tool } from "../../src"

describe("replaced_by.spec.ts / Replaced by another bot", () => {
  const options = {
    replacedByBot: "kz"
  }

  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.shutdown())

  it("Command replacement", async () => {
    let i = 0
    map_command(context.robot, "clear screen", options, () => {
      i++
    })

    let response = await context.sendAndWaitForResponse("@hubot clear screen")
    expect(response).to.eql("Sorry, this feature has been replaced by @kz. Please use:\n```\n@kz clear screen\n```\n")
  })

  it("Tool replacement", async () => {
    map_tool(
      context.robot,
      {
        name: "c",
        commands: [
          {
            name: "d",
            execute: context => context.res.reply("r1")
          }
        ]
      },
      options
    )

    let response = await context.sendAndWaitForResponse("@hubot c d")
    expect(response).to.eql("Sorry, this feature has been replaced by @kz. Please use:\n```\n@kz c d\n```\n")
  })
})
