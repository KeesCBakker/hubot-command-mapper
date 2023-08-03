import pretend from "hubot-pretend"

import { mapper, Options } from "./../src/"
import { expect } from "chai"
import "mocha"

describe("commands.spec.ts / Default commands", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()
    options.addDebugCommand = true
    options.addHelpCommand = true

    mapper(
      pretend.robot,
      {
        name: "test",
        commands: [
          {
            name: "dummy",
            invoke: (tool, robot, res) => {}
          }
        ]
      },
      options
    )
  })

  afterEach(() => pretend.shutdown())

  it("Debug", done => {
    pretend
      .user("kees")
      .send("@hubot test debug")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          '@kees The tool "test" uses the following commands:\n' +
            "- dummy: ^@?hubot test( dummy)$\n" +
            "- debug: ^@?hubot test( debug)$\n" +
            "- help: ^@?hubot test( help| \\?| \\/\\?| \\-\\-help)$"
        )
        done()
      })
      .catch(ex => done(ex))
  })

  it("Invalid command", done => {
    pretend
      .user("kees")
      .send("@hubot test invalid")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq("@kees invalid syntax.")
        done()
      })
      .catch(ex => done(ex))
  })
})
