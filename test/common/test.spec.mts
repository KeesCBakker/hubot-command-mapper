import { expect } from "chai"
import { Robot } from "hubot"
import { TextMessage } from "hubot"
import mockAdapter from "./test-adapter.mjs"

describe("Eddie the shipboard computer", function () {
  var robot
  var user
  var adapter

  beforeEach(done => {
    // create new robot, without http, using the mock adapter
    robot = new Robot(mockAdapter as any, false, "Eddie")

    // start adapter
    robot.loadAdapter().then(() => {
      // 1. programmatically add command:
      robot.hear(/computer!/i, res => res.reply("Why hello there"))

      // 2. or load coffee script file:
      //const coffeeFile = "";
      //robot.loadFile(coffeeFile);

      // 3. or load local JS file
      //const path = ""
      //require(path)(robot);

      robot.adapter.on("connected", () => {
        // create a user
        user = robot.brain.userForId("1", {
          name: "mocha",
          room: "#mocha"
        })
        adapter = robot.adapter
        done()
      })

      // start the bot
      robot.run()
    })
  })

  afterEach(function () {
    robot.shutdown()
  })

  it("responds when greeted", function (done) {
    // here's where the magic happens!
    adapter.on("reply", (_, msg) => {
      expect(msg).match(/Why hello there/)
      done()
    })

    adapter.receive(new TextMessage(user, "Computer!", "RND"))
  })
})
