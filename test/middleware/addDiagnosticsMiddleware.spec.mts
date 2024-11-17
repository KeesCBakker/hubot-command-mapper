import { expect, should } from "chai"
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

    expect(debug!.user).to.eql("mocha")
    expect(debug!.authorized).to.eql(true)
    expect(debug!.text).to.eql("@hubot ping 127.0.0.1")
    expect(debug!.tool).to.eql("ping")
    expect(debug!.command).to.eql("cmd")
    expect(debug!.match[0]).to.eql("@hubot ping 127.0.0.1")
    expect(debug!.values).to.eql({
      rest: "127.0.0.1"
    })
  })

  it("A non command should also trigger a debug callback", async () => {
    let debug: ICommandResolverResultDebugInfo

    addDiagnosticsMiddleware(context.robot, info => (debug = info))

    await context.send("@hubot pong 127.0.0.1")

    expect(debug!.user).to.eql("mocha")
    expect(debug!.text).to.eql("@hubot pong 127.0.0.1")

    should().not.exist(debug!.authorized)
    should().not.exist(debug!.tool)
    should().not.exist(debug!.command)
    should().not.exist(debug!.match)
    should().not.exist(debug!.values)
  })
})
