import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { map_command } from "../src/index.mjs"
import { TestBotContext, createTestBot } from "./common/test-bot.mjs"

describe("same-start-name.spec.ts > execute commands with the same start name", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    map_command(context.robot, "ci", context => context.res.reply("ci"))
    map_command(context.robot, "cd", context => context.res.reply("cd"))
    map_command(context.robot, "cicd", context => context.res.reply("cicd"))
  })

  afterEach(() => context.shutdown())

  it("Testing ci", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ci")
    assert.equal(response, "ci")
  })

  it("Testing cd", async () => {
    let response = await context.sendAndWaitForResponse("@hubot cd")
    assert.equal(response, "cd")
  })

  it("Testing cicd", async () => {
    let response = await context.sendAndWaitForResponse("@hubot cicd")
    assert.equal(response, "cicd")
  })
})
