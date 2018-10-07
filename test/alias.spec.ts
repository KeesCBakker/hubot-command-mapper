const pretend = require("hubot-pretend");

import { mapper, Options, alias, StringParameter } from "./../src";
import { expect } from "chai";
import "mocha";

describe("alias.spec.ts / Testing the alias features", () => {
  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    mapper(
      pretend.robot,
      {
        name: "version",
        invoke: (tool, robot, res) => res.reply("1")
      },
      options
    );

    alias(pretend.robot, { AAA: "version" }, options);

    mapper(
      pretend.robot,
      {
        name: "echo",
        commands: [
          {
            name: "default",
            alias: [""],
            parameters: [new StringParameter("msg")],
            invoke: (tool, robot, res, match, values) => res.reply(values.msg)
          }
        ]
      },
      options
    );

    alias(pretend.robot, { "zeg*": "echo" }, options);
  });

  afterEach(() => pretend.shutdown());

  it("Map alias", done => {
    pretend
      .user("kees")
      .send("@hubot AAA")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot AAA"],
          ["hubot", "@kees 1"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Map * alias", done => {
    pretend
      .user("kees")
      .send("@hubot zeg AAA")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot zeg AAA"],
          ["hubot", "@kees AAA"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

});