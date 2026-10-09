import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { map_command, RestParameter, removeMarkdownFromIncomingMessages } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("removeMarkdownFromIncomingMessages.spec.ts / remove markdown", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    // map dummy command
    map_command(context.robot, "ping", new RestParameter("rest"), context =>
      context.res.reply(`Got this: "${context.values.rest}"`)
    )

    // map the markdown remover
    removeMarkdownFromIncomingMessages(context.robot)
  })

  afterEach(() => context.shutdown())

  it("Bold removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ping this is a *test* with *bold*")
    assert.equal(response, 'Got this: "this is a test with bold"')
  })

  it("Code removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ping this is a `test` with `let code = true`")
    assert.equal(response, 'Got this: "this is a test with let code = true"')
  })

  it("Italics removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ping this is a _test_ with _italics_")
    assert.equal(response, 'Got this: "this is a test with italics"')
  })

  it("Multiple elements removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ping this is a *test* with _italics_ and `code`")
    assert.equal(response, 'Got this: "this is a test with italics and code"')
  })
})
