import pretend from "hubot-pretend"

import { map_command, Options, StringParameter } from "../../src"
import { expect } from "chai"
import "mocha"

describe("map_command.spec.ts / Single command mapping", () => {
  beforeEach(() => {
    pretend.start()
  })

  afterEach(() => pretend.shutdown())

  it("Basic command mapping and invocation", done => {
    let i = 0
    map_command(pretend.robot, "clear screen", () => {
      i++
    })
    pretend
      .user("kees")
      .send("@hubot clear screen")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Basic command mapping and parameter", done => {
    let x = ""
    map_command(pretend.robot, "hello", new StringParameter("person"), context => {
      x = context.values.person
    })
    pretend
      .user("kees")
      .send("@hubot hello world")
      .then(() => {
        expect(x).to.eq("world", "Message should set 'world' to x.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Tool segregation with command mapping", done => {
    let x = ""

    map_command(pretend.robot, "c", context => context.res.reply("r1"))
    map_command(pretend.robot, "cc", context => context.res.reply("r2"))

    pretend
      .user("Kees")
      .send("@hubot c")
      .then(() => new Promise<any>(resolve => setTimeout(resolve, 100)))
      .then(() => {
        expect(pretend.messages).to.eql([
          ["Kees", "@hubot c"],
          ["hubot", "@Kees r1"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Test debug", done => {
    let options = new Options()
    options.addDebugCommand = true
    options.addHelpCommand = true

    map_command(pretend.robot, "my amazing command", options, () => {})

    pretend
      .user("kees")
      .send("@hubot my amazing command debug")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          '@kees The tool "my amazing command" uses the following commands:\n' +
            "- cmd: ^@?hubot my amazing command( cmd)?$\n" +
            "- debug: ^@?hubot my amazing command( debug)$\n" +
            "- help: ^@?hubot my amazing command( help| \\?| \\/\\?| \\-\\-help)$"
        )
        done()
      })
      .catch(ex => done(ex))
  })
})
