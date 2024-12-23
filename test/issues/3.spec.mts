import { expect } from "chai"
import { map_command, alias } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("issues / 3.spec.ts / Testing problems with robot not responding to alias.", async () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot({ name: "namebot", alias: "aliasbot" })
    map_command(context.robot, "ping", context => context.res.reply("pong"))
    alias(context.robot, { pang: "ping" })
  })

  afterEach(() => context.shutdown())

  it("Should respond to the alias and execute the command", async () => {
    let response = await context.sendAndWaitForResponse("@aliasbot ping")
    expect(response).to.eql("pong")
  })

  it("Should respond to the alias and execute the command alias", async () => {
    let response = await context.sendAndWaitForResponse("@aliasbot pang")
    expect(response).to.eql("pong")
  })
})
