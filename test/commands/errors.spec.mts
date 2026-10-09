import assert from "node:assert/strict"
import { describe, it, beforeEach, afterEach } from "node:test"
import { Robot } from "hubot"
import { mapper, alias, ITool } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("errors.spec.ts / Errors", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.robot.shutdown())

  describe("mapper", () => {
    it("No robot", () => {
      assert.throws(() => mapper(null as unknown as Robot, null as unknown as ITool),
        error => error === "Argument 'robot' is empty.")
    })

    it("No tool", () => {
      assert.throws(() => mapper(context.robot, null as unknown as ITool),
        error => error === "Argument 'tool' is empty.")
    })

    it("Invalid tool name due to null", () => {
      assert.throws(() => mapper(context.robot, { name: null as unknown as string, commands: [] }),
        error => error === "Invalid name for tool.")
    })

    it("Invalid tool name due to empty string", () => {
      assert.throws(() => mapper(context.robot, { name: "", commands: [] }),
        error => error === "Invalid name for tool.")
    })

    it("Invalid commands", () => {
      assert.throws(() => mapper(context.robot, { name: "XXX", commands: [] }),
        error => error === 'No commands found for "XXX"')
    })

    it("Invalid tool due to empty command name", () => {
      assert.throws(() => mapper(context.robot, {
        name: "Test", commands: [{ name: "", execute: () => {} }]
      }), error => error === "Invalid command name.")
    })

    it("Invalid tool due to null command name", () => {
      assert.throws(() => mapper(context.robot, {
        name: "Test", commands: [{ name: null as unknown as string, execute: () => {} }]
      }), error => error === "Invalid command name.")
    })

    it("Invalid tool due to reuse command alias", () => {
      assert.throws(() => mapper(context.robot, {
        name: "Test",
        commands: [
          { name: "list", execute: () => {} },
          { name: "list2", alias: ["list"], execute: () => {} }
        ]
      }), error => error === "Cannot create command 'list' for tool 'Test'. Multiple commands with the same name or alias found.")
    })
  })

  describe("alias", () => {
    it("No robot", () => {
      assert.throws(() => alias(null as unknown as Robot, null),
        error => error === "Argument 'robot' is empty.")
    })

    it("No map", () => {
      assert.throws(() => alias(context.robot, null), error => error === "Argument 'map' is empty.")
    })
  })
})
