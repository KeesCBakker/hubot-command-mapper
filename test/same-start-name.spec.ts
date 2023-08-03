import pretend from "hubot-pretend"

import { map_command, IContext } from "./../src/"
import { expect } from "chai"
import "mocha"

describe("same-start-name.spec.ts > execute commands with the same start name", () => {
  beforeEach(() => {
    pretend.start()

    map_command(pretend.robot, "ci", context => context.res.reply("ci"))
    map_command(pretend.robot, "cd", context => context.res.reply("cd"))
    map_command(pretend.robot, "cicd", context => context.res.reply("cicd"))
  })

  afterEach(() => pretend.shutdown())

  it("Testing ci", done => {
    pretend
      .user("kees")
      .send("@hubot ci")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot ci"],
          ["hubot", "@kees ci"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Testing cd", done => {
    pretend
      .user("kees")
      .send("@hubot cd")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot cd"],
          ["hubot", "@kees cd"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Testing cicd", done => {
    pretend
      .user("kees")
      .send("@hubot cicd")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot cicd"],
          ["hubot", "@kees cicd"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })
})
