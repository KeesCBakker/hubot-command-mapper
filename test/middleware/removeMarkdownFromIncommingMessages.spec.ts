import pretend from "hubot-pretend"
import { expect } from "chai"
import "mocha"
import {
  map_command,
  Options,
  RestParameter,
  removeMarkdownFromIncomingMessages,
} from "../../src"

describe("removeMarkdownFromIncomingMessages.spec.ts / remove markdown", () => {
  beforeEach(() => {
    pretend.start()

    // map dummy command
    map_command(
      pretend.robot,
      "ping",
      new RestParameter("rest"),
      context => context.res.reply(`Got this: "${context.values.rest}"`)
    )

    // map the markdown remover
    removeMarkdownFromIncomingMessages(pretend.robot)
  })

  afterEach(() => pretend.shutdown())

  it("Bold removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a *test* with *bold*")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with bold"')
        done()
      })
      .catch(ex => done(ex))
  })

  it("Code removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a `test` with `let code = true`")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          '@kees Got this: "this is a test with let code = true"'
        )
        done()
      })
      .catch(ex => done(ex))
  })

  it("Italics removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a _test_ with _italics_")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with italics"')
        done()
      })
      .catch(ex => done(ex))
  })

  it("Multiple elements removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a *test* with _italics_ and `code`")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          '@kees Got this: "this is a test with italics and code"'
        )
        done()
      })
      .catch(ex => done(ex))
  })
})
