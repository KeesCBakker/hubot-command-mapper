const pretend: Hubot.Pretend = require("hubot-pretend");

import { map_command, Options, alias } from "./../../src";
import { expect } from "chai";
import "mocha";

describe("issues / 3.spec.ts / Testing problems with robot not responding to alias.", () => {

  beforeEach(() => {

    pretend.start({
      name: 'namebot',
      alias:'aliasbot'
    });

    var options = new Options();
    options.verbose = false;

    map_command(pretend.robot, "ping", options, (context) => context.res.reply("pong"));
    alias(pretend.robot, { "pang": "ping" }, options);

  });

  afterEach(() => pretend.shutdown());

  it("Should respond to the alias and execute the command", done => {
    pretend
      .user("kees")
      .send("@aliasbot ping")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@aliasbot ping"],
          ["hubot", "@kees pong"]
        ]);
        done();
      })
      .catch((ex:any) => done(ex));
  });

  it("Should respond to the alias and execute the command alias", done => {
    pretend
      .user("kees")
      .send("@aliasbot pang")
      .then(() => {
        expect(pretend.messages).to.eql([
          ["kees", "@aliasbot pang"],
          ["hubot", "@kees pong"]
        ]);
        done();
      })
      .catch((ex:any) => done(ex));
  });

});
