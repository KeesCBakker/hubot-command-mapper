import { expect } from "chai"
import { map_command } from "../../src/index.mjs"
import { createTestBot } from "../common/test-bot.mjs"

describe("clear-screen.spec.ts > clear screen example", () => {
  it("Scenario", async () => {
    let context = await createTestBot()

    map_command(context.robot, "clear screen", context => {
      for (let i = 0; i < 8; i++) {
        context.res.emote(" ")
      }
    })

    await context.send("@hubot clear screen")

    expect(context.sends).to.eql([" ", " ", " ", " ", " ", " ", " ", " "])
    context.shutdown()
  })
})
