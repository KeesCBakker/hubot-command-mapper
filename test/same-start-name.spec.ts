const pretend = require("hubot-pretend");

import { mapper, Options } from "./../src/";
import { expect } from "chai";
import "mocha";

describe("same-start-name.spec.ts > execute commands with the same start name", () => {
  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    mapper(
      pretend.robot,
      {
        name: "ci",
        invoke: (tool, robot, res): void => {
          res.reply("ci");
        }
      },
      options
    );

    mapper(
      pretend.robot,
      {
        name: "cd",
        invoke: (tool, robot, res): void => {
          res.reply("cd");
        }
      },
      options
    );

    mapper(
      pretend.robot,
      {
        name: "cicd",
        invoke: (tool, robot, res): void => {
          res.reply("cicd");
        }
      },
      options
    );
  });

  afterEach(() => pretend.shutdown());

  it("Testing ci", done => {
    pretend
      .user("kees")
      .send("@hubot ci")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot ci"],
          ["hubot", "@kees ci"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Testing cd", done => {
    pretend
      .user("kees")
      .send("@hubot cd")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot cd"],
          ["hubot", "@kees cd"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Testing cicd", done => {
    pretend
      .user("kees")
      .send("@hubot cicd")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot cicd"],
          ["hubot", "@kees cicd"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });
});
