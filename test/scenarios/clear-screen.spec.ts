import pretend from "hubot-pretend"

import { map_command, Options } from "../../src"
import { expect } from "chai"
import "mocha"

describe("clear-screen.spec.ts > clear screen example", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()
    options.verbose = false

    map_command(pretend.robot, "clear screen", options, context => {
      for (let i = 0; i < 8; i++) {
        context.res.emote(" ")
      }
    })
  })

  afterEach(() => pretend.shutdown())

  it("Scenario", done => {
    const user = pretend.user("kees")

    user
      .send("@hubot clear screen")
      .then(x => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot clear screen"],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
          ["hubot", " "],
        ])
      })
      .then(x => done())
      .catch(ex => done(ex))
  })
})
