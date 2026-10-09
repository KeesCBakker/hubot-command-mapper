import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { hasSwitch, setSwitch } from "../../src/utils/switches.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("switches.spec.ts / switches", () => {
  let context: TestBotContext

  const SWITCH = "SOME_SWITCH_NAME"

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => {
    if (context) {
      context.shutdown()
    }
  })

  it("No parameters set should return false.", async () => {
    assert.equal(hasSwitch(context.robot, SWITCH), false)
  })

  it("Setting a parameter should return true.", async () => {
    setSwitch(context.robot, SWITCH)
    assert.equal(hasSwitch(context.robot, SWITCH), true)
  })
})
