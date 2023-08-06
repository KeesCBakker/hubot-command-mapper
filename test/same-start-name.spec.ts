import { createTestBot, TestBotContext } from "./common/test-bot"
import { expect } from "chai"
import { map_command } from "./../src/"

describe("same-start-name.spec.ts > execute commands with the same start name", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    map_command(context.robot, "ci", context => context.res.reply("ci"))
    map_command(context.robot, "cd", context => context.res.reply("cd"))
    map_command(context.robot, "cicd", context => context.res.reply("cicd"))
  })

  afterEach(() => context.shutdown())

  it("Testing ci", async () => {
    let response = await context.sendAndWaitForResponse("@hubot ci")
    expect(response).to.eql("ci")
  })

  it("Testing cd", async () => {
    let response = await context.sendAndWaitForResponse("@hubot cd")
    expect(response).to.eql("cd")
  })

  it("Testing cicd", async () => {
    let response = await context.sendAndWaitForResponse("@hubot cicd")
    expect(response).to.eql("cicd")
  })
})
