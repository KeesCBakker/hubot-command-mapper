import Hubot, { TextMessage } from "hubot"
import { Robot } from "hubot/es2015"

export class TestBotContext {
  public readonly replies: string[] = []
  public readonly sends: string[] = []

  constructor(
    public readonly robot: Hubot.Robot,
    public readonly user: Hubot.User
  ) {
    this.robot.adapter.on("reply", (_, strings) => {
      this.replies.push(strings.join("\n"))
    })

    this.robot.adapter.on("send", (_, strings) => {
      this.sends.push(strings.join("\n"))
    })
  }

  async sendAndWaitForResponse(message: string) {
    return new Promise<string>(done => {
      // here's where the magic happens!
      this.robot.adapter.once("reply", function (_, strings) {
        done(strings[0])
      })

      const id = (Math.random() + 1).toString(36).substring(7)
      const textMessage = new TextMessage(this.user, message, id)
      this.robot.adapter.receive(textMessage)
    })
  }

  async send(message: string) {
    const id = (Math.random() + 1).toString(36).substring(7)
    const textMessage = new TextMessage(this.user, message, id)
    this.robot.adapter.receive(textMessage)
    await this.wait(1)
  }

  async wait(ms: number) {
    return new Promise<void>(done => {
      setTimeout(() => done(), ms)
    })
  }

  shutdown(): void {
    this.robot.shutdown()
  }
}
export type LoadScriptsFn = (Robot: Hubot.Robot) => void

export type TestBotSettings = {
  name?: string
  alias?: string
  logLevel?: string
  testUserName?: string
}

export async function createTestBot(settings: TestBotSettings | null = null): Promise<TestBotContext> {
  process.env["HUBOT_LOG_LEVEL"] = settings?.logLevel || "error"

  return new Promise<TestBotContext>(done => {
    // create new robot, without http, using the mock adapter
    const botName = settings?.name || "hubot"
    const botAlias = settings?.alias || null
    const robot = new Robot("hubot-mock-adapter", false, botName, botAlias)

    robot.loadAdapter().then(_ => {
      robot.adapter.on("connected", () => {
        // only load scripts we absolutely need, like auth.coffee
        process.env.HUBOT_AUTH_ADMIN = "1"

        // create a user
        const user = robot.brain.userForId("1", {
          name: settings?.testUserName || "mocha",
          room: "#mocha"
        })

        const context = new TestBotContext(robot as unknown as Hubot.Robot, user)
        done(context)
      })

      robot.run()
    })
  })
}
