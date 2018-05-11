const pretend = require("hubot-pretend");

import { mapper, Options, tool } from "./../index";
import { expect } from "chai";
import "mocha";

describe("fluent.spec.ts", () => {
  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    tool("testing")
        .command("command")
        .parameterForRest("stuff")
        .invoke((tool, robot, res, match, values)=>{
            res.reply(values["stuff"]);
        })
        .map(pretend.robot, options);

  });

  afterEach(() => pretend.shutdown());

  it.only("Testing rest parameter.", done => {
    pretend
      .user("kees")
      .send("@hubot testing command 1234")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot testing command 1234"],
          ["hubot", "@kees 1234"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });
});