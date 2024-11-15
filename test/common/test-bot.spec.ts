import { expect } from "chai"
import { TestBotContext, createTestBot } from "./test-bot.js"

describe.only("test-bot testing", async () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot({ name: "namebot", alias: "aliasbot" })
    context.robot.respond(/ping/, context => context.reply("pong"))
  })

  afterEach(() => context.shutdown())

  it("Should respond to the bot name and execute the command", async () => {
    let response = await context.sendAndWaitForResponse("@namebot ping")
    expect(response).to.eql("pong")
  })

  it("Should respond to the alias name and execute the command", async () => {
    let response = await context.sendAndWaitForResponse("@aliasbot ping")
    expect(response).to.eql("pong")
  })
})
