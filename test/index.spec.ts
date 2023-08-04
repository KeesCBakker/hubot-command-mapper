import pretend from "hubot-pretend"

import { map_command, mapper, RestParameter } from "./../src/"
import { expect } from "chai"
import "mocha"

describe("index.spec.ts / Command mapping", () => {
  beforeEach(() => {
    pretend.start()
  })

  afterEach(() => pretend.shutdown())

  it("Basic command mapping and invocation", done => {
    let i = 0
    mapper(pretend.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          execute: _ => i++
        }
      ]
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

  it("Default command mapping", done => {
    let i = 0
    map_command(pretend.robot, "cool", () => i++)
    pretend
      .user("kees")
      .send("@hubot cool")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Alias", done => {
    let i = 0
    mapper(pretend.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["scr"],
          execute: _ => i++
        }
      ]
    })
    pretend
      .user("kees")
      .send("@hubot clear scr")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Empty alias", done => {
    let i = 0
    mapper(pretend.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: [""],
          execute: _ => i++
        }
      ]
    })
    pretend
      .user("kees")
      .send("@hubot clear")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.")
        done()
      })
      .catch(ex => done(ex))
  })

  it("Multiple aliases", done => {
    let i = 0
    mapper(pretend.robot, {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["scr", ""],
          execute: _ => i++
        }
      ]
    })

    Promise.resolve()
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear screen")
          .then(() => expect(i).to.eq(1, "Message should increment i."))
      )
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear scr")
          .then(() => expect(i).to.eq(2, "Message should increment i."))
      )
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear")
          .then(() => expect(i).to.eq(3, "Message should increment i."))
      )
      .then(x => done())
      .catch(ex => done(ex))
  })

  it("Multiple command mapping", done => {
    let latest = ""
    mapper(pretend.robot, {
      name: "tool",
      commands: [
        {
          name: "a",
          execute: _ => (latest = "a")
        },
        {
          name: "b",
          execute: _ => (latest = "b")
        },

        {
          name: "c",
          execute: _ => (latest = "c")
        }
      ]
    })

    Promise.resolve()
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x => done())
      .catch(ex => done(ex))
  })

  it("Tool segregation", done => {
    mapper(pretend.robot, {
      name: "t1",
      commands: [
        {
          name: "c1",
          execute: context => context.res.reply("r1")
        }
      ]
    })

    mapper(pretend.robot, {
      name: "t2",
      commands: [
        {
          name: "c1",
          execute: context => context.res.reply("r2")
        }
      ]
    })

    pretend
      .user("Kees")
      .send("@hubot t2 c1")
      .then(_ => new Promise(resolve => setTimeout(resolve, 100)))
      .then(_ => {
        expect(pretend.messages).to.eql([
          ["Kees", "@hubot t2 c1"],
          ["hubot", "@Kees r2"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Tool and command casing", done => {
    mapper(pretend.robot, {
      name: "testing",
      commands: [
        {
          name: "everything",
          parameters: [new RestParameter("rest")],
          execute: context => context.res.reply("kewl!")
        }
      ]
    })

    pretend
      .user("kees")
      .send("@hubot TeStInG eVeRyThInG and maybe more!")
      .then(_ => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot TeStInG eVeRyThInG and maybe more!"],
          ["hubot", "@kees kewl!"]
        ])
        done()
      })
      .catch(ex => done(ex))
  })
})
