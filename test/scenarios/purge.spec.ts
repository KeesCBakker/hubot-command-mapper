import { expect } from "chai"
import { Robot } from "hubot"
import { map_tool, RestParameter } from "../../src/index.js"
import { createTestBot } from "../common/test-bot.js"

function mapPurge(robot: Robot) {
  map_tool(robot, {
    name: "purge",
    commands: [
      {
        name: "default",
        alias: [""],
        parameters: [new RestParameter("url")],
        execute: async context => context.res.reply("default")
      },
      {
        name: "prefix",
        alias: ["p"],
        parameters: [new RestParameter("url")],
        execute: async context => context.res.reply("prefix")
      },
      {
        name: "images",
        alias: ["image", "img", "i"],
        parameters: [new RestParameter("productId")],
        execute: async context => context.res.reply("images")
      }
    ]
  })
}

describe("purge.spec.ts > purge example", () => {
  it("Scenario", async () => {
    let context = await createTestBot()
    mapPurge(context.robot)
    let response = await context.sendAndWaitForResponse("@hubot purge pers")
    expect(response).to.eql("default")
    context.shutdown()
  })
})
