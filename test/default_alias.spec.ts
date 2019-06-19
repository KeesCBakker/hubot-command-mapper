const pretend: Hubot.Pretend = require("hubot-pretend");

import { map_command, Options, alias, map_default_alias, RestParameter } from "./../src";
import { expect } from "chai";
import "mocha";

describe("default_alias.spec.ts / Testing the default alias feature", () => {

    beforeEach(() => {
        pretend.start();

        var options = new Options();
        options.verbose = false;

        map_command(pretend.robot, "hello", options, new RestParameter('name', 'unknown'), context => context.res.reply(`Hi ${context.values.name}!`));
        map_command(pretend.robot, "bye", options, new RestParameter('name', 'unknown'), context => context.res.reply(`Toodles ${context.values.name}!`));

        alias(pretend.robot, {
            'hi': 'hello',
            'hi*': 'hello'
        }, options);

        map_default_alias(pretend.robot, 'bye', options);
    });

    afterEach(() => pretend.shutdown());

    it("Command mapping", done => {
        pretend
            .user("kees")
            .send("@hubot hello bot")
            .then(() => {
                expect(pretend.messages, "This message should be mapped to the `hello` command.").to.eql([
                    ["kees", "@hubot hello bot"],
                    ["hubot", "@kees Hi bot!"]
                ]);
                done();
            })
            .catch(ex => done(ex));
    });

    it("Alias mapping", done => {
        pretend
            .user("kees")
            .send("@hubot hi bot")
            .then(() => {
                expect(pretend.messages, "This message should be mapped to the `hello` command.").to.eql([
                    ["kees", "@hubot hi bot"],
                    ["hubot", "@kees Hi bot!"]
                ]);
                done();
            })
            .catch(ex => done(ex));
    });

    it("Default alias mapping", done => {
        pretend
            .user("kees")
            .send("@hubot kaas")
            .then(() => {
                expect(pretend.messages, "This message should be mapped to the `bye` command.").to.eql([
                    ["kees", "@hubot kaas"],
                    ["hubot", "@kees Toodles kaas!"]
                ]);
                done();
            })
            .catch(ex => done(ex));
    });


});
