const pretend = require("hubot-pretend");

import { mapper, map_command, Options, alias, StringParameter, IContext } from "./../src";
import { expect } from "chai";
import "mocha";

describe("alias.spec.ts / Testing the alias features", () => {

  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    map_command(pretend.robot, "version", (context:IContext) => context.res.reply("1"));
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
          },
          {
          name: "bye",
          parameters: [
            new StringParameter("firstName"),
            new StringParameter("lastName")
          ],
          invoke: (tool, robot, res, match, values) => res.reply(`Byeeeeeee ${values.firstName} ${values.lastName}!`)
          }
        ]
      },
      options
    );

    alias(pretend.robot, { "zeg*": "echo" }, options);
    alias(pretend.robot, { "scream and shout*": "echo"}, options)
    alias(pretend.robot, { "super doei*": "echo bye"}, options)
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

  it("Map * alias with multiple words", done => {
    pretend
      .user("kees")
      .send("@hubot scream and shout AAA")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot scream and shout AAA"],
          ["hubot", "@kees AAA"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Map * alias with multiple words and multiple parameters", done => {
    pretend
      .user("kees")
      .send("@hubot super doei Alpha Beta")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot super doei Alpha Beta"],
          ["hubot", "@kees Byeeeeeee Alpha Beta!"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });

});
