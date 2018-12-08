const pretend = require("hubot-pretend");

import tools from "./multi-tool-reload";
import { expect } from "chai";
import "mocha";
import { delay } from "../_parameter-testing";

describe("multi-tool-reload.spec.ts > multi reload", () => {

    beforeEach(() => {
        pretend.start();

        pretend.robot.loadFile = file => {
            tools(pretend.robot);
        };

        tools(pretend.robot);
    });

    afterEach(() => pretend.shutdown());

    it("Expect 3 tools.", () => {
        let bot = pretend.robot as Hubot.Robot;
        expect(bot.__tools.length).to.eq(3);
    });

    it("Expect same source.", () => {
        let bot = pretend.robot as Hubot.Robot;
        let source = bot.__tools.find(x => true).__source;

        let sources = bot.__tools.map(x => x.__source);

        expect(sources).to.eql([source, source, source]);
    });

    it("Reload", done => {
        pretend
            .user("kees")
            .send("@hubot ci reload")
            .then(x => delay(1100, x))
            .then(x => {
                let bot = pretend.robot as Hubot.Robot;

                expect(bot.__tools.length).to.eq(6);
                done();
            })
            .catch(ex => done(ex));
    });

    it("Reload and execute", done => {
        pretend
            .user("kees")
            .send("@hubot ci reload")
            .then(x => delay(1100, x))
            .then(x => pretend.user("kees").send("@hubot ci"))
            .then(x => {

                expect(pretend.messages).to.eql(
                    [
                        ['kees', '@hubot ci reload'],
                        ['hubot', '@kees Tool "ci" has been reloaded!'],
                        ['kees', '@hubot ci'],
                        ['hubot', '@kees ci']
                    ]);

                done();
            })
            .catch(ex => done(ex));
    });


});

