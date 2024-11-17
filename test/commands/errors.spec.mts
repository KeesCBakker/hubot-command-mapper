import { expect } from "chai"
import { mapper, alias } from "../../src/index.mjs"
import { TestBotContext, createTestBot } from "../common/test-bot.mjs"

describe("errors.spec.ts / Errors", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.robot.shutdown())

  describe("mapper", () => {
    it("No robot", async () => {
      try {
        mapper(null as any, null as any)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'robot' is empty.")
      }
    })

    it("No tool", async () => {
      try {
        mapper(context.robot, null as any)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'tool' is empty.")
      }
    })

    it("Invalid tool name due to null", async () => {
      try {
        mapper(context.robot, {
          name: null as any,
          commands: []
        })
      } catch (ex) {
        expect(ex.toString()).to.eq("Invalid name for tool.")
      }
    })

    it("Invalid tool name due to empty string", async () => {
      try {
        mapper(context.robot, {
          name: "",
          commands: []
        })
      } catch (ex) {
        expect(ex.toString()).to.eq("Invalid name for tool.")
      }
    })

    it("Invalid commands", async () => {
      try {
        mapper(context.robot, {
          name: "XXX",
          commands: []
        })
      } catch (ex) {
        expect(ex.toString()).to.eq('No commands found for "XXX"')
      }
    })

    it("Invalid tool due to empty command name", async () => {
      try {
        mapper(context.robot, {
          name: "Test",
          commands: [
            {
              name: "",
              execute: _ => {}
            }
          ]
        })
      } catch (ex) {
        expect(ex.toString()).to.eq("Invalid command name.")
      }
    })

    it("Invalid tool due to null command name", async () => {
      try {
        mapper(context.robot, {
          name: "Test",
          commands: [
            {
              name: null as any,
              execute: _ => {}
            }
          ]
        })
      } catch (ex) {
        expect(ex.toString()).to.eq("Invalid command name.")
      }
    })

    it("Invalid tool due to reuse command alias", async () => {
      try {
        mapper(context.robot, {
          name: "Test",
          commands: [
            {
              name: "list",
              execute: _ => {}
            },
            {
              name: "list2",
              alias: ["list"],
              execute: _ => {}
            }
          ]
        })
      } catch (ex) {
        expect(ex.toString()).to.eq(
          "Cannot create command 'list' for tool 'Test'. Multiple commands with the same name or alias found."
        )
      }
    })
  })

  describe("alias", () => {
    it("No robot", async () => {
      try {
        alias(null as any, null as any)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'robot' is empty.")
      }
    })

    it("No map", async () => {
      try {
        alias(context.robot, null)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'map' is empty.")
      }
    })
  })
})
