import { Pretender }  from "../pretender"
const pretend = new Pretender();


import { Options, ITool } from "./../../src/"
import { expect } from "chai"
import "mocha"
import { mapper, StringParameter } from "./../../src/"

describe("examples.spec.ts > check count/capture example", () => {
  it("Should count to 3", done => {
    pretend.start({
      name: "hb",
      alias: "lb",
    })

    var options = new Options()
    options.verbose = false

    const tool: ITool = {
      name: "count",
      commands: [
        {
          name: "from",
          capture: "(\\d+) to (\\d+)",
          execute: context => {
            const a = Number(context.match[context.match.length - 2])
            const b = Number(context.match[context.match.length - 1])

            for (let i = a; i < b + 1; i++) {
              context.res.reply(`${i}!`)
            }
          },
        },
      ],
    }

    mapper(pretend.robot, tool, options)

    pretend
      .user("kees")
      .send("@hb count from 1 to 3")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hb count from 1 to 3"],
          ["hb", "@kees 1!"],
          ["hb", "@kees 2!"],
          ["hb", "@kees 3!"],
        ])

        pretend.shutdown()
        done()
      })
      .catch(ex => done(ex))
  })
})

describe("examples.spec.ts > check norris impersonate / parameter", () => {
  it("Should return a quote", done => {
    pretend.start({
      name: "hb",
      alias: "lb",
    })

    var options = new Options()
    options.verbose = false

    const tool: ITool = {
      name: "norris",
      commands: [
        {
          name: "impersonate",
          parameters: [
            new StringParameter("firstName"),
            new StringParameter("lastName"),
          ],
          execute: context => {
            const firstName = encodeURIComponent(context.values.firstName)
            const lastName = encodeURIComponent(context.values.lastName)

            context.res.reply(
              `${firstName} ${lastName} has counted to infinity. Twice!`
            )
          },
        },
      ],
    }

    mapper(pretend.robot, tool, options)

    pretend
      .user("kees")
      .send("@hb norris impersonate Cool Cat")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hb norris impersonate Cool Cat"],
          ["hb", "@kees Cool Cat has counted to infinity. Twice!"],
        ])

        pretend.shutdown()
        done()
      })
      .catch(ex => done(ex))
  })
})
