import { expect } from "chai"
import { Robot, TextMessage, User } from "hubot"
import mockAdapter from "./test-adapter.mjs"

async function createTestBot() {
  return new Promise<{ robot: Robot; user: User }>(async done => {
    // create new robot, without http, using the mock adapter
    const robot = new Robot(mockAdapter as any, false, "Eddie")

    // start adapter
    await robot.loadAdapter().then(() => {
      // create a user
      const user = robot.brain.userForId("1", {
        name: "mocha",
        room: "#mocha"
      })
      done({
        robot: robot as unknown as Robot,
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
      // 1. programmatically add command:
      robot.hear(/computer!/i, res => res.reply("Why hello there"))

      // here's where the magic happens!
      robot.adapter.on("reply", (envelope, msg) => {
        expect(msg).match(/Why hello there/)

        robot.shutdown()
        done()
      })

      robot.adapter.receive(new TextMessage(user, "Computer!", "RND"))
    })
  })
})
