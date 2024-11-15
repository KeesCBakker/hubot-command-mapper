import { expect } from "chai"
import { Robot } from "hubot"
import { map_tool, RestParameter } from "../../src/index.js"
import { TestBotContext, createTestBot } from "../common/test-bot.js"

function mapTodo(robot: Robot) {
  let todos: string[] = []

  map_tool(robot, {
    name: "todo",
    commands: [
      {
        name: "add",
        alias: [""],
        parameters: [new RestParameter("item")],
        execute: context => {
          todos.push(context.values.item)
          context.res.reply(`Added _${context.values.item}_ to the list.`)
        }
      },
      {
        name: "list",
        alias: [""],
        execute: context => {
          if (!todos.length) context.res.reply("The list is empty.")
          else {
            let txt = "The following item(s) are on the list:\n"
            txt += todos.map(t => "- " + t).join("\n")
            context.res.reply(txt)
          }
        }
      },
      {
        name: "remove",
        alias: ["del", "rm"],
        parameters: [new RestParameter("item")],
        execute: context => {
          const f = context.values.item.toLowerCase()
          const a = todos.filter(t => t.toLowerCase().indexOf(f) == -1)
          const x = todos.length - a.length
          todos = a
          context.res.reply(`Removed ${x} item(s) from the list.`)
        }
      }
    ]
  })
}

describe("todo.spec.ts > todo example", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
    mapTodo(context.robot)
  })

  afterEach(() => context.shutdown())

  it("Scenario", async () => {
    await context.send("@hubot todo Boter halen")

    await context.send("@hubot todo Kaas halen")
    await context.send("@hubot todo Eieren halen")
    await context.send("@hubot todo")
    await context.send("@hubot todo del er")
    await context.send("@hubot todo list")

    expect(context.replies).to.eql([
      "Added _Boter halen_ to the list.",
      "Added _Kaas halen_ to the list.",
      "Added _Eieren halen_ to the list.",
      "The following item(s) are on the list:\n- Boter halen\n- Kaas halen\n- Eieren halen",
      "Removed 2 item(s) from the list.",
      "The following item(s) are on the list:\n- Kaas halen"
    ])
  })
})
