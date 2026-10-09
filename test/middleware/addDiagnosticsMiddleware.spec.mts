import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import {
  map_command,
  RestParameter,
  ICommandResolverResultDebugInfo,
  addDiagnosticsMiddleware
} from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("addDiagnosticsMiddleware.spec.ts / testing diagnostics middleware", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()

    // map dummy command
    map_command(context.robot, "ping", new RestParameter("rest"), context =>
      context.res.reply(`Got this: "${context.values.rest}"`)
    )
  })

  afterEach(() => context.shutdown())

  it("A command should trigger a debug callback", async () => {
    let debug: ICommandResolverResultDebugInfo

    addDiagnosticsMiddleware(context.robot, info => {
      debug = info
    })

    await context.send("@hubot ping 127.0.0.1")

    assert.equal(debug!.user, "mocha")
    assert.equal(debug!.authorized, true)
    assert.equal(debug!.text, "@hubot ping 127.0.0.1")
    assert.equal(debug!.tool, "ping")
    assert.equal(debug!.command, "cmd")
    assert.equal(debug!.match?.[0], "@hubot ping 127.0.0.1")
    assert.deepEqual(debug!.values, {
      rest: "127.0.0.1"
    })
  })

  it("A non command should also trigger a debug callback", async () => {
    let debug: ICommandResolverResultDebugInfo

    addDiagnosticsMiddleware(context.robot, info => (debug = info))

    await context.send("@hubot pong 127.0.0.1")

    assert.equal(debug!.user, "mocha")
    assert.equal(debug!.text, "@hubot pong 127.0.0.1")

    assert.equal(debug!.authorized, undefined)
    assert.equal(debug!.tool, null)
    assert.equal(debug!.command, null)
    assert.equal(debug!.match, null)
    assert.equal(debug!.values, undefined)
  })
})
