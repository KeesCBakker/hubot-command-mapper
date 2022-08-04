import { Pretender }  from "./pretender"
const pretend = new Pretender();

import {
  map_tool,
  map_command,
  Options,
  alias,
  map_default_alias,
  RestParameter,
} from "./../src"
import { expect } from "chai"
import "mocha"

describe("default_alias.spec.ts / Testing the default alias feature", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()
    options.verbose = false

    map_command(
      pretend.robot,
      "hello",
      options,
      new RestParameter("name", "unknown"),
      context => context.res.reply(`Hi ${context.values.name}!`)
    )
    map_command(
      pretend.robot,
      "bye",
      options,
      new RestParameter("name", "unknown"),
      context => context.res.reply(`Toodles ${context.values.name}!`)
    )
    map_tool(
      pretend.robot,
      {
        name: "echo",
        commands: [
          {
            name: "default",
            parameters: [new RestParameter("what", "unknown")],
            alias: [""],
            execute: context =>
              context.res.reply(`Echo ${context.values.what}!`),
          },
        ],
      },
      options
    )

    alias(
      pretend.robot,
      {
        "hi*": "hello",
        "say*": "echo",
      },
      options
    )

    map_default_alias(pretend.robot, "bye", [/help/i], options)
    1
    alias(
      pretend.robot,
      {
        "shout*": "echo",
      },
      options
    )
  })

  afterEach(() => pretend.shutdown())

  it("Tool mapping", done => {
    pretend
      .user("kees")
      .send("@hubot echo bot")
      .then(() => {
        expect(
          pretend.messages,
          "This message should be mapped to the `echo` command."
        ).to.eql([
          ["kees", "@hubot echo bot"],
          ["hubot", "@kees Echo bot!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Tool alias mapping", done => {
    pretend
      .user("kees")
      .send("@hubot say bot")
      .then(() => {

        expect(
          pretend.messages,
          "This message should be mapped to the `echo` command."
        ).to.eql([
          ["kees", "@hubot say bot"],
          ["hubot", "@kees Echo bot!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Command mapping", done => {
    pretend
      .user("kees")
      .send("@hubot hello bot")
      .then(() => {
        expect(
          pretend.messages,
          "This message should be mapped to the `hello` command."
        ).to.eql([
          ["kees", "@hubot hello bot"],
          ["hubot", "@kees Hi bot!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Command alias mapping", done => {
    pretend
      .user("kees")
      .send("@hubot hi bot")
      .then(() => {
        expect(
          pretend.messages,
          "This message should be mapped to the `hello` command."
        ).to.eql([
          ["kees", "@hubot hi bot"],
          ["hubot", "@kees Hi bot!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Default alias mapping", done => {
    pretend
      .user("kees")
      .send("@hubot kaas")
      .then(() => {
        expect(
          pretend.messages,
          "This message should be mapped to the `bye` command."
        ).to.eql([
          ["kees", "@hubot kaas"],
          ["hubot", "@kees Toodles kaas!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Alias mapped after detault", done => {
    pretend
      .user("kees")
      .send("@hubot shout bot")
      .then(() => {
        expect(
          pretend.messages,
          "This message should be mapped to the `echo` command."
        ).to.eql([
          ["kees", "@hubot shout bot"],
          ["hubot", "@kees Echo bot!"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })

  it("Alias should skip help", done => {
    pretend
      .user("kees")
      .send("@hubot help")
      .then(() => {
        expect(pretend.messages, "This message should not be handled.").to.eql([
          ["kees", "@hubot help"],
        ])
        done()
      })
      .catch(ex => done(ex))
  })
})

describe("default_alias.spec.ts / exceptions", () => {
  it("Exception on mapping twice", () => {
    var options = new Options()
    options.verbose = false

    pretend.start()

    // map 1st alias
    map_default_alias(pretend.robot, "alpha", [], options)

    // 2nd alias should throw an exception
    expect(() =>
      map_default_alias(pretend.robot, "beta", [], options)
    ).to.throw(
      "A default has already been mapped. Cannot map a 2nd default alias."
    )

    pretend.shutdown()
  })

  it("Exception on empty alias", () => {
    var options = new Options()
    options.verbose = false

    pretend.start()

    expect(() => map_default_alias(pretend.robot, "", [], options)).to.throw(
      "Argument 'destination' is empty."
    )

    pretend.shutdown()
  })

  it("Exception on empty robot", () => {
    var options = new Options()
    options.verbose = false

    expect(() => map_default_alias(null, "alpha", [], options)).to.throw(
      "Argument 'robot' is empty."
    )
  })
})
