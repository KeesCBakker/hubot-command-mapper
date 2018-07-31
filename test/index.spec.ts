const pretend = require("hubot-pretend");

import { mapper, Options, RestParameter } from "./../src/";
import { expect } from "chai";
import "mocha";

describe("mapper.spec.ts / Command mapping", () => {
  const options = new Options();
  options.verbose = false;

  beforeEach(() => {
    pretend.name = "hubot";
    pretend.alias = "hubot";
    pretend.start();
  });

  afterEach(() => pretend.shutdown());

  it("Basic command mapping and invocation", done => {
    let i = 0;
    mapper(
      pretend.robot,
      {
        name: "clear",
        commands: [
          {
            name: "screen",
            invoke: (tool, robot, res, match) => i++
          }
        ]
      },
      options
    );
    pretend
      .user("kees")
      .send("@hubot clear screen")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.");
        done();
      })
      .catch(ex => done(ex));
  });

  it("Alias", done => {
    let i = 0;
    mapper(
      pretend.robot,
      {
        name: "clear",
        commands: [
          {
            name: "screen",
            alias: ["scr"],
            invoke: (tool, robot, res, match) => i++
          }
        ]
      },
      options
    );
    pretend
      .user("kees")
      .send("@hubot clear scr")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.");
        done();
      })
      .catch(ex => done(ex));
  });

  it("Empty alias", done => {
    let i = 0;
    mapper(
      pretend.robot,
      {
        name: "clear",
        commands: [
          {
            name: "screen",
            alias: [""],
            invoke: (tool, robot, res, match) => i++
          }
        ]
      },
      options
    );
    pretend
      .user("kees")
      .send("@hubot clear")
      .then(() => {
        expect(i).to.eq(1, "Message should increment i.");
        done();
      })
      .catch(ex => done(ex));
  });

  it("Multiple aliases", done => {
    let i = 0;
    mapper(
      pretend.robot,
      {
        name: "clear",
        commands: [
          {
            name: "screen",
            alias: ["scr", ""],
            invoke: (tool, robot, res, match) => i++
          }
        ]
      },
      options
    );

    new Promise(resolve => resolve())
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear screen")
          .then(() => expect(i).to.eq(1, "Message should increment i."))
      )
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear scr")
          .then(() => expect(i).to.eq(2, "Message should increment i."))
      )
      .then(x =>
        pretend
          .user("kees")
          .send("@hubot clear")
          .then(() => expect(i).to.eq(3, "Message should increment i."))
      )
      .then(x => done())
      .catch(ex => done(ex));
  });

  it("Multiple command mapping", done => {
    let latest = "";
    mapper(
      pretend.robot,
      {
        name: "tool",
        commands: [
          {
            name: "a",
            invoke: (tool, robot, res, match) => (latest = "a")
          },
          {
            name: "b",
            invoke: (tool, robot, res, match) => (latest = "b")
          },

          {
            name: "c",
            invoke: (tool, robot, res, match) => (latest = "c")
          }
        ]
      },
      options
    );

    new Promise(resolve => resolve())
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x =>
        pretend
          .user("Kees")
          .send("@hubot tool a")
          .then(x => expect(latest).to.eq("a", "'a' was not called."))
      )
      .then(x => done())
      .catch(ex => done(ex));
  });

  it("Tool segregation", done => {
    mapper(
      pretend.robot,
      {
        name: "t1",
        commands: [
          {
            name: "c1",
            invoke: (tool, robot, res, match) => res.reply("r1")
          }
        ]
      },
      options
    );

    mapper(
      pretend.robot,
      {
        name: "t2",
        commands: [
          {
            name: "c1",
            invoke: (tool, robot, res, match) => res.reply("r2")
          }
        ]
      },
      options
    );

    pretend
      .user("Kees")
      .send("@hubot t2 c1")
      .then(x => new Promise(resolve => setTimeout(resolve, 100)))
      .then(x => {
        expect(pretend.messages).to.eql([
          ["Kees", "@hubot t2 c1"],
          ["hubot", "@Kees r2"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });


  it("Tool and command casing", done => {
    mapper(pretend.robot, {
      name: "testing",
      commands: [{
        name: "everything",
        parameters: [ new RestParameter("rest") ],
        invoke: (tool, robot, res) => res.reply("kewl!")
      }]
    }, options);

    pretend
      .user("kees")
      .send("@hubot TeStInG eVeRyThInG and maybe more!")
      .then(x => {
        expect(pretend.messages).to.eql([
          ["kees", "@hubot TeStInG eVeRyThInG and maybe more!"],
          ["hubot", "@kees kewl!"]
        ]);
        done();
      })
      .catch(ex => done(ex));
  });
});
