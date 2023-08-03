import pretend from "hubot-pretend"
import { expect } from "chai"
import "mocha"
import {
  map_command,
  Options,
  RestParameter,
  removeTrailingBotWhitespaceCharactersFromIncomingMessages,
  addDiagnosticsMiddleware,
  ICommandResolverResultDebugInfo,
} from "../../src"

import { should } from "chai"

describe("addDiagnosticsMiddleware.spec.ts / testing diagnostics middleware", () => {
  beforeEach(() => {
    pretend.start()

    // map dummy command
    map_command(pretend.robot, "ping", new RestParameter("rest"), context =>
      context.res.reply(`Got this: "${context.values.rest}"`)
    )
  })

  afterEach(() => pretend.shutdown())

  it("A command should trigger a debug callback", done => {
    let debug: ICommandResolverResultDebugInfo

    addDiagnosticsMiddleware(pretend.robot, info => {
      debug = info
    })

    pretend
      .user("kees")
      .send("@hubot ping 127.0.0.1")
      .then(() => {
        expect(debug.user).to.eql("kees")
        expect(debug.authorized).to.eql(true)
        expect(debug.text).to.eql("@hubot ping 127.0.0.1")
        expect(debug.tool).to.eql("ping")
        expect(debug.command).to.eql("cmd")
        expect(debug.match[0]).to.eql("@hubot ping 127.0.0.1")
        expect(debug.values).to.eql({
          rest: "127.0.0.1",
        })

        done()
      })
      .catch(ex => done(ex))
  })

  it("A non command should also trigger a debug callback", done => {
    let debug: ICommandResolverResultDebugInfo

    addDiagnosticsMiddleware(pretend.robot, info => (debug = info))

    pretend
      .user("kees")
      .send("@hubot pong 127.0.0.1")
      .then(() => {
        expect(debug.user).to.eql("kees")
        expect(debug.text).to.eql("@hubot pong 127.0.0.1")

        should().not.exist(debug.authorized)
        should().not.exist(debug.tool)
        should().not.exist(debug.command)
        should().not.exist(debug.match)
        should().not.exist(debug.values)

        done()
      })
      .catch(ex => done(ex))
  })
})
