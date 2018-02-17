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
describe("Default commands", () => {
    const robot = createNewRobotAndMapTool("Kees", {
        name: "Test",
        commands: [
            {
                name: "dummy",
                invoke: (tool, robot, res) => { }
            }
        ]
    });
    it("debug", done => {
        robot.onReply.one((robot, message) => {
            chai_1.expect(message).to.eq('The tool "Test" uses the following commands:\n- dummy: ^@?Kees Test( dummy)$\n- debug: ^@?Kees Test( debug)$\n- reload: ^@?Kees Test( reload)$\n- help: ^@?Kees Test( help| \\?| \\/\\?| \\-\\-help)$');
            done();
        });
        robot.receive("@Kees test debug", "1337", "42");
    });
    it("help", done => {
        robot.onReply.one((robot, message) => {
            //cannot be tested
            done();
        });
        robot.receive("@Kees test help", "1337", "42");
    });
    it("reload", done => {
        robot.onReply.one((robot, message) => {
            //cannot be tested
            done();
        });
        robot.receive("@Kees test reload", "1337", "42");
    });
});
