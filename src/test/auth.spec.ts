import { mapper } from "./../";
import { expect } from "chai";
import "mocha";

import createNewRobotAndMapTool from "./mocks/creator";

describe("auth.spec.ts / Default commands", () => {
  const robot = createNewRobotAndMapTool("Kees", {
    name: "test",
    auth: ["user1", "user2"],
    commands: [
      {
        name: "action1",
        invoke: (tool, robot, res) => res.reply("Hi!")
      },
      {
        name: "action2",
        auth: ["user2"],
        invoke: (tool, robot, res) => res.reply("Hi!")
      }
    ]
  });

  it("Not authenticated for tool", done => {
    robot.onReply.one((robot, message) => {
      expect(message).to.eq(
        "sorry, you are not authorized to use this command."
      );
      done();
    });
    robot.receive("@Kees test action1", "NotAuthenticated", "42");
  });

  it("Authenticated for tool", done => {
    robot.onReply.one((robot, message) => {
      expect(message).to.eq("Hi!");
      done();
    });
    robot.receive("@Kees test action1", "user1", "42");
  });

  it("Not authenticated for command", done => {
    robot.onReply.one((robot, message) => {
      expect(message).to.eq(
        "sorry, you are not authorized to use this command."
      );
      done();
    });
    robot.receive("@Kees test action2", "user1", "42");
  });

  it("Authenticated for command", done => {
    robot.onReply.one((robot, message) => {
      expect(message).to.eq("Hi!");
      done();
    });
    robot.receive("@Kees test action2", "user2", "42");
  });
});
