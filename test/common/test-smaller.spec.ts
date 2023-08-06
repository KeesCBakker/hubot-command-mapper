import { expect } from "chai"
import { Robot } from "hubot/es2015"
import { TextMessage } from "hubot"

async function createTestBot() {
  return new Promise<{ robot: Hubot.Robot; user: Hubot.User }>(async done => {
    // create new robot, without http, using the mock adapter
    const robot = new Robot("hubot-mock-adapter", false, "Eddie")

    // start adapter
    await robot.loadAdapter()

    robot.adapter.on("connected", () => {
      // create a user
      const user = robot.brain.userForId("1", {
        name: "mocha",
        room: "#mocha"
      })
      done({
        robot: robot as unknown as Hubot.Robot,
        user
      })
    })

    // start the bot
    robot.run()
  })
}

describe("Eddie the shipboard computer - smaller", function () {
  it("responds when greeted", function (done) {
    createTestBot().then(({ robot, user }) => {
      // 1. programatically add command:
      robot.hear(/computer!/i, res => res.reply("Why hello there"))

      // here's where the magic happens!
      robot.adapter.on("reply", (envelope, strings) => {
        expect(strings[0]).match(/Why hello there/)

        robot.shutdown()
        done()
      })

      robot.adapter.receive(new TextMessage(user, "Computer!", "RND"))
    })
  })
})
