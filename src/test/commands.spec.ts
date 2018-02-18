import { mapper } from "./../mapper";
import { expect } from "chai";
import "mocha";

import { createNewRobotAndMapTool } from "./mocks/creator";

describe("commands.spec.ts / Default commands", () => {
  const robot = createNewRobotAndMapTool("Kees", {
    name: "test",
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
        'The tool "test" uses the following commands:\n' +
          "- dummy: ^@?Kees test( dummy)$\n" +
          "- debug: ^@?Kees test( debug)$\n" +
          "- reload: ^@?Kees test( reload)$\n" +
          "- help: ^@?Kees test( help| \\?| \\/\\?| \\-\\-help)$"
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

  it("Invalid command", done => {
    robot.onReply.one((robot, message) => {
      //cannot be tested
      expect(message).to.eq("invalid syntax.");
      done();
    });
    robot.receive("@Kees test invalid", "1337", "42");
  });

  it("Reload", done => {
    const robot = createNewRobotAndMapTool("Kees", {
      name: "test",
      commands: [
        {
          name: "dummy",
          invoke: (tool, robot, res) => {}
        }
      ]
    });

    robot.onReply.one((robot, message) => {
      //cannot be tested
      expect(message).to.eq('Tool "test" has been reloaded!');
      done();
    });

    robot.receive("@Kees test reload", "1337", "42");
  });
});
