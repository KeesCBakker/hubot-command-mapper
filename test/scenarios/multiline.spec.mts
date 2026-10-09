import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { createTestBot, TestBotContext } from "../common/test-bot.mjs"
import { map_command, RestParameter } from "../../src/index.mjs"

describe("multiline.spec.ts > todo example", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
    map_command(context.robot, "act", new RestParameter("value"), context => context.res.reply(context.values.value))
  })

  afterEach(() => context.shutdown())

  it("one line", async () => {
    let line = "And now the end is here"
    let result = await context.sendAndWaitForResponse("hubot act " + line)
    assert.equal(result, line)
  })

  it("two lines", async () => {
    let line = "And now the end is here\nAnd so I face that final curtain"
    let result = await context.sendAndWaitForResponse("hubot act " + line)
    assert.equal(result, line)
  })

  it("three lines", async () => {
    let line = "And now the end is here\nAnd so I face that final curtain\nMy friend I'll make it clear"
    let result = await context.sendAndWaitForResponse("hubot act " + line)
    assert.equal(result, line)
  })
})
