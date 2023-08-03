import pretend from "hubot-pretend"

import { map_tool, RestParameter } from "./../../src/"
import { expect } from "chai"
import "mocha"

function mapPurge(robot: Hubot.Robot) {
  map_tool(robot, {
    name: "purge",
    commands: [
      {
        name: "default",
        alias: [""],
        parameters: [new RestParameter("url")],
        execute: async context => context.res.reply("default"),
      },
      {
        name: "prefix",
        alias: ["p"],
        parameters: [new RestParameter("url")],
        execute: async context => context.res.reply("prefix"),
      },
      {
        name: "images",
        alias: ["image", "img", "i"],
        parameters: [new RestParameter("productId")],
        execute: async context => context.res.reply("images"),
      },
    ],
  })
}

describe("purge.spec.ts > purge example", () => {
  beforeEach(() => {
    pretend.start()
    mapPurge(pretend.robot)
  })

  afterEach(() => pretend.shutdown())

  it("Scenario", done => {
    const user = pretend.user("kees")

    user
      .send("@hubot purge pers")
      .then(x => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot purge pers"],
          ["hubot", "@kees default"],
        ])
      })
      .then(_ => done())
      .catch(ex => done(ex))
  })
})
