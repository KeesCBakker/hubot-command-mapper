import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { mapper, RegExStringParameter, NumberParameter, TokenParameter, IPv4Parameter } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("scenarios.spec.ts > wehkamp glitch", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    mapper(context.robot, {
      name: "wehkamp",
      commands: [
        {
          name: "glitch",
          parameters: [
            new RegExStringParameter("url", "https?://", "https://wehkamp.nl"),
            new NumberParameter("times", 350)
          ],
          execute: context => context.res.reply(JSON.stringify(context.values))
        },
        {
          name: "ip",
          parameters: [
            new TokenParameter("source"),
            new IPv4Parameter("sourceIp"),
            new TokenParameter("destination"),
            new IPv4Parameter("destinationIp")
          ],
          execute: context => context.res.reply(JSON.stringify(context.values))
        }
      ]
    })
  })

  afterEach(() => context.shutdown())

  it("Testing 2 parameters", async () => {
    let response = await context.sendAndWaitForResponse("@hubot wehkamp glitch https://google.com 150")
    assert.equal(response, `{"url":"https://google.com","times":"150"}`)
  })

  it("Testing default parameters", async () => {
    let response = await context.sendAndWaitForResponse("@hubot wehkamp glitch")
    assert.equal(response, `{"url":"https://wehkamp.nl","times":350}`)
  })

  it("Testing only 1st parameters", async () => {
    let response = await context.sendAndWaitForResponse("@hubot wehkamp glitch https://google.com")
    assert.equal(response, `{"url":"https://google.com","times":350}`)
  })

  it("Testing only 2nd parameters", async () => {
    let response = await context.sendAndWaitForResponse("@hubot wehkamp glitch 70")
    assert.equal(response, `{"url":"https://wehkamp.nl","times":"70"}`)
  })

  it("Test IPv4", async () => {
    let response = await context.sendAndWaitForResponse("@hubot wehkamp ip source 192.168.1.13 destination 10.0.0.13")
    assert.equal(response,
      `{"source":"source","sourceIp":"192.168.1.13","destination":"destination","destinationIp":"10.0.0.13"}`
    )
  })
})
