const pretend: Hubot.Pretend = require("hubot-pretend")

import { map_tool, Options, RestParameter } from "./../../src/"
import { expect } from "chai"
import "mocha"

function mapTodo(robot: Hubot.Robot) {
  let options = new Options()
  options.verbose = false
  let todos: string[] = []

  map_tool(
    robot,
    {
      name: "todo",
      commands: [
        {
          name: "add",
          alias: [""],
          parameters: [new RestParameter("item")],
          execute: context => {
            todos.push(context.values.item)
            context.res.reply(`Added _${context.values.item}_ to the list.`)
          },
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
          },
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
          },
        },
      ],
    },
    options
  )
}

describe("todo.spec.ts > todo example", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()
    options.verbose = false

    mapTodo(pretend.robot)
  })

  afterEach(() => pretend.shutdown())

  it("Scenario", done => {
    const user = pretend.user("kees")

    user
      .send("@hubot todo Boter halen")
      .then(x => user.send("@hubot todo Kaas halen"))
      .then(x => user.send("@hubot todo Eieren halen"))
      .then(x => user.send("@hubot todo"))
      .then(x => user.send("@hubot todo del er"))
      .then(x => user.send("@hubot todo list"))
      .then(x => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot todo Boter halen"],
          ["hubot", "@kees Added _Boter halen_ to the list."],
          ["kees", "@hubot todo Kaas halen"],
          ["hubot", "@kees Added _Kaas halen_ to the list."],
          ["kees", "@hubot todo Eieren halen"],
          ["hubot", "@kees Added _Eieren halen_ to the list."],
          ["kees", "@hubot todo"],
          [
            "hubot",
            "@kees The following item(s) are on the list:\n- Boter halen\n- Kaas halen\n- Eieren halen",
          ],
          ["kees", "@hubot todo del er"],
          ["hubot", "@kees Removed 2 item(s) from the list."],
          ["kees", "@hubot todo list"],
          [
            "hubot",
            "@kees The following item(s) are on the list:\n- Kaas halen",
          ],
        ])
      })
      .then(x => done())
      .catch(ex => done(ex))
  })
})
