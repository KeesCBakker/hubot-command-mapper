import Hubot, { TextMessage } from "hubot"
import { Robot } from "hubot/es2015"

export type ResponseType = "send" | "reply"

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

  async sendAndWaitForResponse(message: string, responseType: ResponseType = "reply") {
    return new Promise<string>(done => {
      this.robot.adapter.once(responseType, function (_, strings) {
        done(strings[0])
      })

      this.send(message)
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
    delete process.env.HUBOT_LOG_LEVEL
  }
}

export type TestBotSettings = {
  name?: string
  alias?: string
  logLevel?: string
  testUserName?: string
}

export async function createTestBot(settings: TestBotSettings | null = null): Promise<TestBotContext> {
  process.env.HUBOT_LOG_LEVEL = settings?.logLevel || "silent"

  return new Promise<TestBotContext>(async done => {
    // create new robot, without http, using the mock adapter
    const botName = settings?.name || "hubot"
    const botAlias = settings?.alias || null
    const robot = new Robot("hubot-mock-adapter", false, botName, botAlias)

    await robot.loadAdapter()

    robot.adapter.on("connected", () => {
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
}
