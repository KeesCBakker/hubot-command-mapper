import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { map_command, StringParameter, Options } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("map_command.spec.ts / Single command mapping", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.robot.shutdown())

  it("Basic command mapping and invocation", async () => {
    let i = 0
    map_command(context.robot, "clear screen", () => {
      i++
    })

    await context.send("@hubot clear screen")
    assert.equal(i, 1, "Message should increment i.")
  })

  it("Basic command mapping and parameter", async () => {
    let x = ""
    map_command(context.robot, "hello", new StringParameter("person"), context => {
      x = context.values.person
    })

    await context.send("@hubot hello world")
    assert.equal(x, "world", "Message should set 'world' to x.")
  })

  it("Tool segregation with command mapping", async () => {
    map_command(context.robot, "c", context => context.res.reply("r1"))
    map_command(context.robot, "cc", context => context.res.reply("r2"))

    let response = await context.sendAndWaitForResponse("@hubot c")
    assert.equal(response, "r1")

    response = await context.sendAndWaitForResponse("@hubot cc")
    assert.equal(response, "r2")
  })

  it("Test debug", async () => {
    let options = new Options()
    options.addDebugCommand = true
    options.addHelpCommand = true

    map_command(context.robot, "my amazing command", options, () => {})

    let response = await context.sendAndWaitForResponse("@hubot my amazing command debug")
    assert.equal(response,
      'The tool "my amazing command" uses the following commands:\n' +
        "- cmd: ^@?hubot my amazing command( cmd)?$\n" +
        "- debug: ^@?hubot my amazing command( debug)$\n" +
        "- help: ^@?hubot my amazing command( help| \\?| \\/\\?| \\-\\-help)$"
    )
  })
})
