import pretend from "hubot-pretend"

import { mapper, Options } from "./../src/index"
import { expect } from "chai"
import "mocha"

describe("auth.spec.ts / Default commands", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()

    mapper(
      pretend.robot,
      {
        name: "test",
        auth: ["user1", "user2"],
        commands: [
          {
            name: "action1",
            invoke: (tool, robot, res) => res.reply("Hi!")
          },
          {
            name: "action2",
            auth: ["user2"],
            invoke: (tool, robot, res) => res.reply("Hi!")
          }
        ]
      },
      options
    )
  })

  afterEach(() => pretend.shutdown())

  it("Not authenticated for tool", done => {
    pretend
      .user("kees")
      .send("@hubot test action1")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot test action1"],
          ["hubot", "@kees sorry, you are not authorized to use this command."]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Authenticated for tool", done => {
    pretend
      .user("user1")
      .send("@hubot test action1")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["user1", "@hubot test action1"],
          ["hubot", "@user1 Hi!"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Not authenticated for command", done => {
    pretend
      .user("user1")
      .send("@hubot test action2")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["user1", "@hubot test action2"],
          ["hubot", "@user1 sorry, you are not authorized to use this command."]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Authenticated for command", done => {
    pretend
      .user("user2")
      .send("@hubot test action2")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["user2", "@hubot test action2"],
          ["hubot", "@user2 Hi!"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })
})
