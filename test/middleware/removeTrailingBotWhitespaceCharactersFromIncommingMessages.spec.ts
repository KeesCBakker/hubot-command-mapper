import { createTestBot, TestBotContext } from "./../common/test-bot"
import { expect } from "chai"
import { map_command, removeTrailingBotWhitespaceCharactersFromIncomingMessages, RestParameter } from "../../src"

describe("removeTrailingBotWhitespaceCharactersFromIncomingMessages.spec.ts / trailing spaces fixer", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    // map dummy command
    map_command(context.robot, "ping", new RestParameter("rest"), context =>
      context.res.reply(`Got this: "${context.values.rest}"`)
    )

    // map the trailing space fixer
    removeTrailingBotWhitespaceCharactersFromIncomingMessages(context.robot)
  })

  afterEach(() => context.shutdown())

  it("Trailing spaces should be removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot     ping this is a test with spaces")
    expect(response).to.eq('Got this: "this is a test with spaces"')
  })

  it("Trailing tabs should be removed", async () => {
    let response = await context.sendAndWaitForResponse("@hubot\t\tping this is a test with tabs")
    expect(response).to.eq('Got this: "this is a test with tabs"')
  })

  it("Trailing enters should be removed", async () => {
    let response = await context.sendAndWaitForResponse(
      `@hubot


ping this is a test with enters`
    )
    expect(response).to.eq('Got this: "this is a test with enters"')
  })
})
