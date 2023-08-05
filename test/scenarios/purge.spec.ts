import { createTestBot } from "../common/test"
import { expect } from "chai"
import { map_tool, RestParameter } from "./../../src/"
import "mocha"

function mapPurge(robot: Hubot.Robot) {
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
