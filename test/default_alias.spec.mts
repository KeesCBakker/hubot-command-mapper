import { Robot } from "hubot"
import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import { map_command, RestParameter, map_tool, alias, map_default_alias } from "../src/index.mjs"
import { TestBotContext, createTestBot } from "./common/test-bot.mjs"

describe("default_alias.spec.ts / Testing the default alias feature", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    map_command(context.robot, "hello", new RestParameter("name", "unknown"), context =>
      context.res.reply(`Hi ${context.values.name}!`)
    )
    map_command(context.robot, "bye", new RestParameter("name", "unknown"), context =>
      context.res.reply(`Toodles ${context.values.name}!`)
    )
    map_tool(context.robot, {
      name: "echo",
      commands: [
        {
          name: "default",
          parameters: [new RestParameter("what", "unknown")],
          alias: [""],
          execute: context => context.res.reply(`Echo ${context.values.what}!`)
        }
      ]
    })

    alias(context.robot, {
      "hi*": "hello",
      "say*": "echo"
    })

    map_default_alias(context.robot, "bye", [/help/i])
    alias(context.robot, {
      "shout*": "echo"
    })
  })

  afterEach(() => context.shutdown())

  it("Tool mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot echo bot")
    assert.equal(response, "Echo bot!", "This message should be mapped to the `echo` command.")
  })

  it("Tool alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot say bot")
    assert.equal(response, "Echo bot!", "This message should be mapped to the `echo` command.")
  })

  it("Command mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot hello bot")
    assert.equal(response, "Hi bot!", "This message should be mapped to the `hello` command.")
  })

  it("Command alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot hi bot")
    assert.equal(response, "Hi bot!", "This message should be mapped to the `hello` command.")
  })

  it("Default alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot kaas")
    assert.equal(response, "Toodles kaas!", "This message should be mapped to the `bye` command.")
  })

  it("Alias mapped after default", async () => {
    let response = await context.sendAndWaitForResponse("@hubot shout bot")
    assert.equal(response, "Echo bot!", "This message should be mapped to the `echo` command.")
  })

  it("Alias should skip help", async () => {
    await context.send("@hubot help")

    assert.deepEqual(context.sends, [])
    assert.equal(context.replies.length, 1)
    assert.ok(context.replies[0].includes("Available commands:"))
    assert.ok(!context.replies[0].includes("Toodles"))
  })

  it("leaves messages not addressed to the bot unchanged", async () => {
    let receivedText: string | undefined
    context.robot.receiveMiddleware(async middleware => {
      if (middleware.response.message.text != null) receivedText = middleware.response.message.text
      return true
    })

    await context.send("hello everyone")

    assert.equal(receivedText, "hello everyone")
    assert.deepEqual(context.sends, [])
    assert.deepEqual(context.replies, [])
  })
})

describe("default_alias.spec.ts / exceptions", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.shutdown())

  it("Exception on mapping twice", async () => {
    // map 1st alias
    map_default_alias(context.robot, "alpha", [])

    // 2nd alias should throw an exception
    assert.throws(() => map_default_alias(context.robot, "beta", []),
      error => error === "A default has already been mapped. Cannot map a 2nd default alias."
    )
  })

  it("Exception on empty alias", () => {
    assert.throws(() => map_default_alias(context.robot, "", []), error => error === "Argument 'destination' is empty.")
  })

  it("Exception on empty robot", () => {
    assert.throws(() => map_default_alias(null as unknown as Robot, "alpha", []), error => error === "Argument 'robot' is empty.")
  })
})
