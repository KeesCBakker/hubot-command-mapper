import { createTestBot } from "../common/test"
import { expect } from "chai"
import { map_command } from "../../src"
import "mocha"

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
