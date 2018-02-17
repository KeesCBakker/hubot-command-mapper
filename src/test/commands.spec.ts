import mapper from "./../mapper";
import { expect } from "chai";
import "mocha";

import MockedBot from "./mocks/mocked-bot";

function createNewRobotAndMapTool(name: string, tool: ITool) {
  const robot = new MockedBot(name);
  mapper(robot, tool, false);
  return robot;
}

describe("Default commands", () => {
  const robot = createNewRobotAndMapTool("Kees", {
    name: "Test",
    commands: [
      {
        name: "dummy",
        invoke: (tool, robot, res) => {}
      }
    ]
  });

  it("Debug", done => {
    robot.onReply.one((robot, message) => {
      expect(message).to.eq(
        'The tool "Test" uses the following commands:\n' +
          "- dummy: ^@?Kees Test( dummy)$\n" +
          "- debug: ^@?Kees Test( debug)$\n" +
          "- reload: ^@?Kees Test( reload)$\n" +
          "- help: ^@?Kees Test( help| \\?| \\/\\?| \\-\\-help)$"
      );
      done();
    });
    robot.receive("@Kees test debug", "1337", "42");
  });

  it("Help", done => {
    robot.onReply.one((robot, message) => {
      //cannot be tested
      done();
    });
    robot.receive("@Kees test help", "1337", "42");
  });

  it("Reload", done => {
    robot.onReply.one((robot, message) => {
      //cannot be tested
      done();
    });
    robot.receive("@Kees test reload", "1337", "42");
  });
});
