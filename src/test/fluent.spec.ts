const pretend = require("hubot-pretend");

import { mapper, Options, tool } from "./../index";
import { expect } from "chai";
import "mocha";

var options = new Options();
options.verbose = false;

describe("fluent.spec.ts", () => {
    beforeEach(() => {
        pretend.name = "hubot";
        pretend.alias = "hubot";
        pretend.start();
    });

    afterEach(() => pretend.shutdown());

    it("todo", done => {
        var _todos = [];

        tool("todo")
            .command("add")
            .alias("")
            .parameterForRest("item")
            .invoke((tool, robot, res, match, values) => {
                _todos.push(values["item"]);
                res.reply("Added the item to the list.")
            })
            .command("list")
            .alias("lst")
            .alias("")
            .invoke((tool, robot, res, match, values) => {
                if (_todos.length === 0) {
                    res.reply("The todo list is empty.")
                    return;
                }

                let i = 0;
                let str = "The following items are on the list:\n";
                str += _todos.map(t => ++i + t).join("\n");
                res.reply(str);
            })
            .command("remove")
            .alias("rm")
            .alias("del")
            .parameterForRest("item")
            .invoke((tool, robot, res, match, values) => {
                let item = values["item"].toLowerCase();
                let l = _todos.length;
                _todos = _todos.filter(f => f.toLowerCase().indexOf(item) == -1);
                let i = l - _todos.length;
                if (i === 1) {
                    res.reply("1 item was removed.")
                }
                else {
                    res.reply(`${i} items were removed.`);
                }
            })
            .map(pretend.robot, options);

        let user = pretend.user("kees");

        user
            .send("@hubot todo Boter halen")
            .then(x => user.send("@hubot todo Kaas halen"))
            .then(x => user.send("@hubot todo Eieren halen"))
            .then(x => user.send("@hubot todo"))
            .then(x => user.send("@hubot todo remove er"))
            .then(x => user.send("@hubot todo"))
            .then(x => {
                expect(pretend.messages).to.eql(
                    [
                        ['kees', '@hubot todo Boter halen'],
                        ['hubot', '@kees Added the item to the list.'],
                        ['kees', '@hubot todo Kaas halen'],
                        ['hubot', '@kees Added the item to the list.'],
                        ['kees', '@hubot todo Eieren halen'],
                        ['hubot', '@kees Added the item to the list.'],
                        ['kees', '@hubot todo'],
                        ['hubot', '@kees The following items are on the list:\n1Boter halen\n2Kaas halen\n3Eieren halen'],
                        ['kees', '@hubot todo remove er'],
                        ['hubot', '@kees 2 items were removed.'],
                        ['kees', '@hubot todo'],
                        ['hubot', "@kees The following items are on the list:\n1Kaas halen"]
                    ]
                );
            })
            .then(x => done())
            .catch(ex => done(ex));


    });
});
