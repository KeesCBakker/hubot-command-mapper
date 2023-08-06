import { createTestBot, TestBotContext } from "../common/test-bot"
import { expect } from "chai"
import { hasSwitch, setSwitch } from "../../src/utils/switches"

describe("switches.spec.ts / switches", () => {
  let context: TestBotContext

  const SWITCH = "SOME_SWITCH_NAME"

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.shutdown())

  it("No parameters set should return false.", async () => {
    expect(hasSwitch(context.robot, SWITCH)).to.eql(false)
  })

  it("Setting a parameter should return true.", async () => {
    setSwitch(context.robot, SWITCH)
    expect(hasSwitch(context.robot, SWITCH)).to.eql(true)
  })
})
