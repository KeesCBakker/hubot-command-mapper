import pretend from "hubot-pretend"
import { expect } from "chai"
import "mocha"
import {
  map_command,
  RestParameter,
  removeTrailingBotWhitespaceCharactersFromIncomingMessages,
} from "../../src"

describe("removeTrailingBotWhitespaceCharactersFromIncomingMessages.spec.ts / trailing spaces fixer", () => {
  beforeEach(() => {
    pretend.start()

    // map dummy command
    map_command(pretend.robot, "ping", new RestParameter("rest"), context =>
      context.res.reply(`Got this: "${context.values.rest}"`)
    )

    // map the trailing space fixer
    removeTrailingBotWhitespaceCharactersFromIncomingMessages(pretend.robot)
  })

  afterEach(() => pretend.shutdown())

  it("Trailing spaces should be removed", done => {
    pretend
      .user("kees")
      .send("@hubot     ping this is a test with spaces")
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
      .send("@hubot\t\tping this is a test with tabs")
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
        `@hubot


ping this is a test with enters`
      )
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq('@kees Got this: "this is a test with enters"')
        done()
      })
      .catch(ex => done(ex))
  })
})
