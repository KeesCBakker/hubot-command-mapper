"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("./../mapper");
const chai_1 = require("chai");
require("mocha");
const mocked_bot_1 = require("./mocks/mocked-bot");
function createNewRobotAndMapTool(name, tool) {
    const robot = new mocked_bot_1.default(name);
    mapper_1.default(robot, tool, false);
    return robot;
}
describe("Command mapping", () => {
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
        chai_1.expect(i).to.eq(1, "Message should increment i.");
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
        chai_1.expect(i).to.eq(1, "Message should increment i.");
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
        chai_1.expect(i).to.eq(1, "Message should increment i.");
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
        chai_1.expect(i).to.eq(1, "'clear' should increment i.");
        robot.receive("@Kees clear scr", "Kees", "1337");
        chai_1.expect(i).to.eq(2, "'clear scr' should increment i.");
        robot.receive("@Kees clear screen", "Kees", "1337");
        chai_1.expect(i).to.eq(3, "'clear screen' should increment i.");
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
        chai_1.expect(latest).to.eq("a", "'a' was not called.");
        robot.receive("@Kees tool b", "Kees", "1337");
        chai_1.expect(latest).to.eq("b", "'b' was not called.");
        robot.receive("@Kees tool c", "Kees", "1337");
        chai_1.expect(latest).to.eq("c", "'c' was not called.");
    });
});
