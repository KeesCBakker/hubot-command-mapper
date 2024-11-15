import { expect } from "chai"
import { Options, map_command, alias, mapper, StringParameter } from "../src/index.js"
import { TestBotContext, createTestBot } from "./common/test-bot.js"

describe("alias.spec.ts / Testing the alias features", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    var options = new Options()

    map_command(context.robot, "version", options, context => context.res.reply("1"))
    alias(context.robot, { AAA: "version" })

    mapper(
      context.robot,
      {
        name: "echo",
        commands: [
          {
            name: "default",
            alias: [""],
            parameters: [new StringParameter("msg")],
            execute: context => context.res.reply(context.values.msg)
          },
          {
            name: "bye",
            parameters: [new StringParameter("firstName"), new StringParameter("lastName")],
            execute: context => context.res.reply(`Byeeeeeee ${context.values.firstName} ${context.values.lastName}!`)
          }
        ]
      },
      options
    )

    alias(context.robot, { "zeg*": "echo" })
    alias(context.robot, { "scream and shout*": "echo" })
    alias(context.robot, { "super doei*": "echo bye" })
  })

  afterEach(() => context.shutdown())

  it("Map alias", async () => {
    let response = await context.sendAndWaitForResponse("@hubot AAA")
    expect(response).to.eql("1")
  })

  it("Map * alias", async () => {
    let response = await context.sendAndWaitForResponse("@hubot zeg AAA")
    expect(response).to.eql("AAA")
  })

  it("Map * alias with multiple words", async () => {
    let response = await context.sendAndWaitForResponse("@hubot scream and shout AAA")
    expect(response).to.eql("AAA")
  })

  it("Map * alias with multiple words and multiple parameters", async () => {
    let response = await context.sendAndWaitForResponse("@hubot super doei Alpha Beta")
    expect(response).to.eql("Byeeeeeee Alpha Beta!")
  })
})
