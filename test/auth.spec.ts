import { createTestBot, TestBotContext } from "./common/test"
import { expect } from "chai"
import { mapper, Options } from "./../src/index"
import "mocha"

describe("auth.spec.ts / Default commands", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot({
      testUserName: "user1"
    })

    var options = new Options()

    mapper(
      context.robot,
      {
        name: "test",
        auth: ["user1", "user2"],
        commands: [
          {
            name: "action1",
            execute: context => context.res.reply("Hi!")
          },
          {
            name: "action2",
            auth: ["user2"],
            execute: context => context.res.reply("Hi!")
          }
        ]
      },
      options
    )
  })

  afterEach(() => context.shutdown())

  it("Authenticated for tool", async () => {
    let response = await context.sendAndWaitForResponse("@hubot test action1")
    expect(response).to.eql("Hi!")
  })

  it("Not authenticated for command", async () => {
    let response = await context.sendAndWaitForResponse("@hubot test action2")
    expect(response).to.eql("sorry, you are not authorized to use this command.")
  })
})
