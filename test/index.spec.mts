import { expect } from "chai"
import { mapper, map_command, RestParameter } from "../src/index.mjs"
import { TestBotContext, createTestBot } from "./common/test-bot.mjs"

describe("index.spec.ts / Command mapping", () => {
  let context: TestBotContext
  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.shutdown())

  it("Basic command mapping and invocation", async () => {
    let i = 0
    mapper(context.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          execute: _ => i++
        }
      ]
    })
    await context.send("@hubot clear screen")
    expect(i).to.eq(1, "Message should increment i.")
  })

  it("Default command mapping", async () => {
    let i = 0
    map_command(context.robot, "cool", () => i++)
    await context.send("@hubot cool")
    expect(i).to.eq(1, "Message should increment i.")
  })

  it("Alias", async () => {
    let i = 0
    mapper(context.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["scr"],
          execute: _ => i++
        }
      ]
    })
    await context.send("@hubot clear scr")
    expect(i).to.eq(1, "Message should increment i.")
  })

  it("Empty alias", async () => {
    let i = 0
    mapper(context.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: [""],
          execute: _ => i++
        }
      ]
    })
    await context.send("@hubot clear")
    expect(i).to.eq(1, "Message should increment i.")
  })

  it("Multiple aliases", async () => {
    let i = 0
    mapper(context.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["scr", ""],
          execute: _ => i++
        }
      ]
    })

    await context.send("@hubot clear screen")
    expect(i).to.eq(1, "Message should increment i.")

    await context.send("@hubot clear scr")
    expect(i).to.eq(2, "Message should increment i.")

    await context.send("@hubot clear")
    expect(i).to.eq(3, "Message should increment i.")
  })

  it("Multiple command mapping", async () => {
    let latest = ""
    mapper(context.robot, {
      name: "tool",
      commands: [
        {
          name: "a",
          execute: _ => (latest = "a")
        },
        {
          name: "b",
          execute: _ => (latest = "b")
        },

        {
          name: "c",
          execute: _ => (latest = "c")
        }
      ]
    })

    await context.send("@hubot tool a")
    expect(latest).to.eq("a", "'a' was not called.")
    await context.send("@hubot tool a")
    expect(latest).to.eq("a", "'a' was not called.")
    await context.send("@hubot tool a")
    expect(latest).to.eq("a", "'a' was not called.")
  })

  it("Tool segregation", async () => {
    mapper(context.robot, {
      name: "t1",
      commands: [
        {
          name: "c1",
          execute: context => context.res.reply("r1")
        }
      ]
    })

    mapper(context.robot, {
      name: "t2",
      commands: [
        {
          name: "c1",
          execute: context => context.res.reply("r2")
        }
      ]
    })

    let response = await context.sendAndWaitForResponse("@hubot t2 c1")
    expect(response).to.eql("r2")
  })

  it("Tool and command casing", async () => {
    mapper(context.robot, {
      name: "testing",
      commands: [
        {
          name: "everything",
          parameters: [new RestParameter("rest")],
          execute: context => context.res.reply("kewl!")
        }
      ]
    })

    let response = await context.sendAndWaitForResponse("@hubot TeStInG eVeRyThInG and maybe more!")
    expect(response).to.eql("kewl!")
  })
})
