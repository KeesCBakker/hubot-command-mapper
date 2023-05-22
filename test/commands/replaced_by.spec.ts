import pretend from "hubot-pretend"

import { map_command, Options } from "../../src"
import { expect } from "chai"
import "mocha"

describe("replaced_by.spec.ts / Replaced by another bot", () => {
  const options = new Options()
  options.verbose = false
  options.replacedByBot = "kz"

  beforeEach(() => {
    pretend.start()
  })

  afterEach(() => pretend.shutdown())

  it("Command replacement", done => {
    let i = 0
    map_command(pretend.robot, "clear screen", options, () => {
      i++
    })
    pretend
      .user("kees")
      .send("@hubot clear screen")

      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot clear screen"],
          [
            "hubot",
            "@kees Sorry, this feature has been replaced by @kz. Please use:\n```'n@kz clear screen\n```\n",
          ],
        ])

        expect(i).to.eq(0, "Message should not increment i.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Tool replacement", done => {
    let x = ""

    map_command(pretend.robot, "c", options, context => context.res.reply("r1"))
    map_command(pretend.robot, "cc", options, context =>
      context.res.reply("r2")
    )

    pretend
      .user("kees")
      .send("@hubot c")
      .then(() => new Promise<any>(resolve => setTimeout(resolve, 100)))
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot c"],
          [
            "hubot",
            "@kees Sorry, this feature has been replaced by @kz. Please use:\n```'n@kz c\n```\n",
          ],
        ])
        done()
      })
      .catch(ex => done(ex))
  })
})
