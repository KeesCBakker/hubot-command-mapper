import { Robot } from "hubot"
import { expect } from "chai"
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
    expect(response, "This message should be mapped to the `echo` command.").to.eql("Echo bot!")
  })

  it("Tool alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot say bot")
    expect(response, "This message should be mapped to the `echo` command.").to.eql("Echo bot!")
  })

  it("Command mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot hello bot")
    expect(response, "This message should be mapped to the `hello` command.").to.eql("Hi bot!")
  })

  it("Command alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot hi bot")
    expect(response, "This message should be mapped to the `hello` command.").to.eql("Hi bot!")
  })

  it("Default alias mapping", async () => {
    let response = await context.sendAndWaitForResponse("@hubot kaas")
    expect(response, "This message should be mapped to the `bye` command.").to.eql("Toodles kaas!")
  })

  it("Alias mapped after default", async () => {
    let response = await context.sendAndWaitForResponse("@hubot shout bot")
    expect(response, "This message should be mapped to the `echo` command.").to.eql("Echo bot!")
  })

  it("Alias should skip help", async () => {
    let response = await context.send("@hubot help")

    expect(context.sends, "This message should not be handled.").to.eql([])
    expect(context.replies, "This message should not be handled.").to.eql([])
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
    expect(() => map_default_alias(context.robot, "beta", [])).to.throw(
      "A default has already been mapped. Cannot map a 2nd default alias."
    )
  })

  it("Exception on empty alias", () => {
    expect(() => map_default_alias(context.robot, "", [])).to.throw("Argument 'destination' is empty.")
  })

  it("Exception on empty robot", () => {
    expect(() => map_default_alias(null as unknown as Robot, "alpha", [])).to.throw("Argument 'robot' is empty.")
  })
})
