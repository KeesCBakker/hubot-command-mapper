import { mapper, alias } from "../../src"
import { expect } from "chai"

import { TestBotContext, createTestBot } from "../common/test-bot"

describe("errors.spec.ts / Errors", () => {
  let context: TestBotContext

  beforeEach(async () => {
    context = await createTestBot()
  })

  afterEach(() => context.robot.shutdown())

  describe("mapper", () => {
    it("No robot", async () => {
      try {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        mapper(<any>null, <any>null)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'robot' is empty.")
      }
    })

    it("No tool", async () => {
      try {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        mapper(context.robot, <any>null)
      } catch (ex) {
        expect(ex.toString()).to.eq("Argument 'tool' is empty.")
      }
    })

    it("Invalid tool name due to null", async () => {
      try {
        mapper(context.robot, {
          name: <any>null,
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
              execute: () => {}
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
              name: <any>null,
              execute: () => {}
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
              execute: () => {}
            },
            {
              name: "list2",
              alias: ["list"],
              execute: () => {}
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
        const fn: (x: unknown, y: unknown) => void = alias as unknown as (x: unknown, y: unknown) => void
        fn(null, null)
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
