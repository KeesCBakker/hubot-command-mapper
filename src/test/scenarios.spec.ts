const pretend = require("hubot-pretend");

import { mapper, Options, NumberParameter } from "./../";
import { expect } from "chai";
import "mocha";
import { StringParameter, RegExStringParameter } from "../parameters/StringParameters";
import { Tool } from "../tool";
import { Command } from "../commands/commmand";

describe("scenarios.spec.ts > named tool", () => {

  it("Map tool and command.", (done) => {
    var tool = new Tool("kaas");
    tool.commands.push(new Command("haas", [],
      (tool, robot, res) => {
        res.reply("hi");
      }
    ));

    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    mapper(pretend.robot, tool, options);

    pretend
      .user("kees")
      .send("@hubot kaas haas")
      .then(() => {
        var message = pretend.messages[1][1];
        expect(message).to.eq(`@kees hi`);
        done();
      })
      .catch(ex => done(ex));

  });
});

describe("scenarios.spec.ts > wehkamp glitch", () => {
  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();

    var options = new Options();
    options.verbose = false;

    mapper(pretend.robot, {
      name: "wehkamp",
      commands: [
        {
          name: "glitch",
          parameters: [
            new RegExStringParameter("url", "https?://", "https://wehkamp.nl"),
            new NumberParameter("times", 350)
          ],
          invoke: (tool, robot, res, match, values): void => {
            res.reply(JSON.stringify(values));
          }
        }
      ]
    }, options);
  });

  afterEach(() => pretend.shutdown());

  it("Testing 2 parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch https://google.com 150")
      .then(() => {
        var message = pretend.messages[1][1];
        expect(message).to.eq(`@kees {"url":"https://google.com","times":"150"}`);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Testing default parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch")
      .then(() => {
        var message = pretend.messages[1][1];
        expect(message).to.eq(`@kees {"url":"https://wehkamp.nl","times":350}`);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Testing only 1st parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch https://google.com")
      .then(() => {
        var message = pretend.messages[1][1];
        expect(message).to.eq(`@kees {"url":"https://google.com","times":350}`);
        done();
      })
      .catch(ex => done(ex));
  });

  it("Testing only 2nd parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch 70")
      .then(() => {
        var message = pretend.messages[1][1];
        expect(message).to.eq(`@kees {"url":"https://wehkamp.nl","times":"70"}`);
        done();
      })
      .catch(ex => done(ex));
  });


});
