import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { TestBotContext, createTestBot } from "./test-bot.mjs"

describe("test-bot testing", async () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot({ name: "namebot", alias: "aliasbot" })
    context.robot.respond(/ping/, context => context.reply("pong"))
  })

  afterEach(() => context.shutdown())

  it("Should respond to the bot name and execute the command", async () => {
    let response = await context.sendAndWaitForResponse("@namebot ping")
    assert.equal(response, "pong")
  })

  it("Should respond to the alias name and execute the command", async () => {
    let response = await context.sendAndWaitForResponse("@aliasbot ping")
    assert.equal(response, "pong")
  })
})
