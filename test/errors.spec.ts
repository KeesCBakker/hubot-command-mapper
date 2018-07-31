const pretend = require("hubot-pretend");

import { mapper } from "./../src/";
import { expect } from "chai";
import "mocha";

describe("erros.spec.ts / Errors", () => {
  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();
  });

  afterEach(() => pretend.shutdown());

  it("No robot", done => {
    try {
      mapper(null, null);
    } catch (ex) {
      expect(ex.toString()).to.eq("Argument 'robot' is empty.");
      done();
    }
  });

  it("No tool", done => {
    try {
      mapper(pretend.robot, null);
    } catch (ex) {
      expect(ex.toString()).to.eq("Argument 'tool' is empty.");
      done();
    }
  });

  it("Invalid tool name due to null", done => {
    try {
      mapper(pretend.robot, {
        name: null,
        commands: []
      });
    } catch (ex) {
      expect(ex.toString()).to.eq("Invalid name for tool.");
      done();
    }
  });

  it("Invalid tool name due to empty string", done => {
    try {
      mapper(pretend.robot, {
        name: "",
        commands: []
      });
    } catch (ex) {
      expect(ex.toString()).to.eq("Invalid name for tool.");
      done();
    }
  });

  it("Invalid tool due to empty command name", done => {
    try {
      mapper(pretend.robot, {
        name: "Test",
        commands: [
          {
            name: "",
            invoke: (tool, robot, res) => {}
          }
        ]
      });
    } catch (ex) {
      expect(ex.toString()).to.eq("Invalid command name.");
      done();
    }
  });

  it("Invalid tool due to null command name", done => {
    try {
      mapper(pretend.robot, {
        name: "Test",
        commands: [
          {
            name: null,
            invoke: (tool, robot, res) => {}
          }
        ]
      });
    } catch (ex) {
      expect(ex.toString()).to.eq("Invalid command name.");
      done();
    }
  });

  it("Invalid tool due to reuse command alias", done => {
    try {
      mapper(pretend.robot, {
        name: "Test",
        commands: [
          {
            name: "list",
            invoke: (tool, robot, res) => {}
          },
          {
            name: "list2",
            alias: ["list"],
            invoke: (tool, robot, res) => {}
          }
        ]
      });
    } catch (ex) {
      expect(ex.toString()).to.eq(
        "Cannot create command 'list' for tool 'Test'. Multiple commands with the same name or alias found."
      );
      done();
    }
  });
});
