import { mapper } from "./../mapper";
import { expect } from "chai";
import "mocha";
import { createNewRobotAndMapTool } from "./mocks/creator";

describe("mapper.spec.ts / Command mapping", () => {
  it("Basic command mapping and invocation", () => {
    let i = 0;
    let robot = createNewRobotAndMapTool("Kees", {
      name: "clear",
      commands: [
        {
          name: "screen",
          invoke: (tool, robot, res, match) => i++
        }
      ]
    });

    robot.receive("@Kees clear screen", "Kees", "1337");
    expect(i).to.eq(1, "Message should increment i.");
  });

  it("Alias", () => {
    let i = 0;
    let robot = createNewRobotAndMapTool("Kees", {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["scr"],
          invoke: (tool, robot, res, match) => i++
        }
      ]
    });

    robot.receive("@Kees clear scr", "Kees", "1337");
    expect(i).to.eq(1, "Message should increment i.");
  });

  it("Empty alias", () => {
    let i = 0;
    let robot = createNewRobotAndMapTool("Kees", {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: [""],
          invoke: (tool, robot, res, match) => i++
        }
      ]
    });

    robot.receive("@Kees clear", "Kees", "1337");
    expect(i).to.eq(1, "Message should increment i.");
  });

  it("Multiple aliases", () => {
    let i = 0;

    let robot = createNewRobotAndMapTool("Kees", {
      name: "clear",
      commands: [
        {
          name: "screen",
          alias: ["", "screen", "scr"],
          invoke: (tool, robot, res, match) => i++
        }
      ]
    });

    robot.receive("@Kees clear", "Kees", "1337");
    expect(i).to.eq(1, "'clear' should increment i.");

    robot.receive("@Kees clear scr", "Kees", "1337");
    expect(i).to.eq(2, "'clear scr' should increment i.");

    robot.receive("@Kees clear screen", "Kees", "1337");
    expect(i).to.eq(3, "'clear screen' should increment i.");
  });

  it("Multiple command mapping", () => {
    let latest = "";
    let robot = createNewRobotAndMapTool("Kees", {
      name: "tool",
      commands: [
        {
          name: "a",
          invoke: (tool, robot, res, match) => (latest = "a")
        },
        {
          name: "b",
          invoke: (tool, robot, res, match) => (latest = "b")
        },

        {
          name: "c",
          invoke: (tool, robot, res, match) => (latest = "c")
        }
      ]
    });

    robot.receive("@Kees tool a", "Kees", "1337");
    expect(latest).to.eq("a", "'a' was not called.");

    robot.receive("@Kees tool b", "Kees", "1337");
    expect(latest).to.eq("b", "'b' was not called.");

    robot.receive("@Kees tool c", "Kees", "1337");
    expect(latest).to.eq("c", "'c' was not called.");
  });

  it("Tool segregation", () => {
    let robot = createNewRobotAndMapTool(
      "Kees",
      {
        name: "t1",
        commands: [
          {
            name: "c1",
            invoke: (tool, robot, res, match) => res.reply("r1")
          }
        ]
      },
      {
        name: "t2",
        commands: [
          {
            name: "c1",
            invoke: (tool, robot, res, match) => res.reply("r2")
          }
        ]
      }
    );

    let msg = [];
    robot.onReply.sub((r, txt) => msg.push(txt));

    robot.receive("@Kees t2 c1", "Kees", "1337");

    expect(msg.length).to.eq(1, "There should be one replied message.");
    expect(msg[0]).to.eq("r2", "The message should be 'r2'.");
  });
});
