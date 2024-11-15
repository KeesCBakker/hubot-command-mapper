import { expect } from "chai"
import { Robot, TextMessage, User } from "hubot"

class TestBotContext {
  constructor(
    public readonly robot: Robot,
    public readonly user: User
  ) {}

  async sendAndWaitForResponse(message: string, type: "send" | "reply" = "reply") {
    return new Promise<string>(done => {
      // here's where the magic happens!
      this.robot.adapter.once(type, function (_, strings) {
        done(strings[0])
      })

      const id = (Math.random() + 1).toString(36).substring(7)
      const textMessage = new TextMessage(this.user, message, id)
      this.robot.adapter.receive(textMessage)
    })
  }
}

async function createTestBot() {
  return new Promise<TestBotContext>(async done => {
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
      done(new TestBotContext(robot as unknown as Robot.Hubot, user))
    })

    // start the bot
    robot.run()
  })
}

describe("Eddie the shipboard computer - sendAndWaitForResponse", function () {
  it("responds when greeted", async () => {
    let context = await createTestBot()

    // 1. programatically add command:
    context.robot.hear(/computer!/i, res => res.reply("Why hello there"))

    let response = await context.sendAndWaitForResponse("Computer!")
    expect(response).match(/Why hello there/)

    context.robot.shutdown()
  })
})
