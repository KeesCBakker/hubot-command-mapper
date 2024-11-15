import { Adapter, Envelope, Robot } from "hubot"

export class MockAdapter extends Adapter {
  name: string

  constructor(robot: Robot) {
    super(robot)
    this.name = "MockAdapter"
  }

  async send(envelope: Envelope, ...strings: string[]) {
    super.emit("send", envelope, ...strings)
  }

  async reply(envelope: Envelope, ...strings: string[]) {
    super.emit("reply", envelope, ...strings)
  }

  async topic(envelope: Envelope, ...strings: string[]) {
    super.emit("topic", envelope, ...strings)
  }

  async play(envelope: Envelope, ...strings: string[]) {
    super.emit("play", envelope, ...strings)
  }

  run() {
    // This is required to get the scripts loaded
    super.emit("connected")
  }

  close() {
    super.emit("closed")
  }
}
export default {
  use(robot: Robot) {
    return new MockAdapter(robot)
  }
}
