const pretend: Hubot.Pretend = require("hubot-pretend")
import { expect } from "chai"
import "mocha"
import {
  map_command,
  Options,
  RestParameter,
  removeTrailingWhitespaceCharactersFromIncommingMessages,
} from "../../src"

describe("removeTrailingWhitespaceCharactersFromIncommingMessages.spec.ts / trailing spaces fixer", () => {
  beforeEach(() => {
    pretend.start()
    var options = new Options()
    options.verbose = false

    // map dummy command
    map_command(
      pretend.robot,
      "ping",
      new RestParameter("rest"),
      options,
      context => context.res.reply(`Got this: "${context.values.rest}"`)
    )

    // map the trailing space fixer
    removeTrailingWhitespaceCharactersFromIncommingMessages(
      pretend.robot,
      options
    )
  })

  afterEach(() => pretend.shutdown())

  it("Trailing spaces should be removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a test with spaces     ")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with spaces"')
        done()
      })
      .catch(ex => done(ex))
  })

  it("Trailing tabs should be removed", done => {
    pretend
      .user("kees")
      .send("@hubot ping this is a test with tabs           ")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with tabs"')
        done()
      })
      .catch(ex => done(ex))
  })

  it("Trailing enters should be removed", done => {
    pretend
      .user("kees")
      .send(
        `@hubot ping this is a test with enters

`
      )
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with enters"')
        done()
      })
      .catch(ex => done(ex))
  })
})
