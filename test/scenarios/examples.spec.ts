import { createTestBot } from "../common/test-bot"
import { expect } from "chai"
import { ITool } from "./../../src/"
import { mapper, StringParameter } from "./../../src/"

describe("examples.spec.ts > check count/capture example", () => {
  it("Should count to 3", async () => {
    let context = await createTestBot({
      name: "hb",
      alias: "lb"
    })

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
          }
        }
      ]
    }

    mapper(context.robot, tool)

    await context.send("@hb count from 1 to 3")
    expect(context.replies).to.eql(["1!", "2!", "3!"])

    context.shutdown()
  })
})

describe("examples.spec.ts > check norris impersonate / parameter", () => {
  it("Should return a quote", async () => {
    let context = await createTestBot({
      name: "hubot",
      alias: "hb"
    })

    const tool: ITool = {
      name: "norris",
      commands: [
        {
          name: "impersonate",
          parameters: [new StringParameter("firstName"), new StringParameter("lastName")],
          execute: context => {
            const firstName = encodeURIComponent(context.values.firstName)
            const lastName = encodeURIComponent(context.values.lastName)

            context.res.reply(`${firstName} ${lastName} has counted to infinity. Twice!`)
          }
        }
      ]
    }

    mapper(context.robot, tool)

    let response = await context.sendAndWaitForResponse("@hb norris impersonate Cool Cat")
    expect(response).to.eql("Cool Cat has counted to infinity. Twice!")

    context.shutdown()
  })
})
