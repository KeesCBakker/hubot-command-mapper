const pretend: Hubot.Pretend = require("hubot-pretend");

import { Options, map_command, IContext } from "./../src/";
import { expect } from "chai";
import "mocha";

describe("same-start-name.spec.ts > execute commands with the same start name", () => {

  beforeEach(() => {
    pretend.start();

    var options = new Options();
    options.verbose = false;

    map_command(pretend.robot, "ci", (context) => context.res.reply("ci"), options);
    map_command(pretend.robot, "cd", (context) => context.res.reply("cd"), options);
    map_command(pretend.robot, "cicd", (context) => context.res.reply("cicd"), options);

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
