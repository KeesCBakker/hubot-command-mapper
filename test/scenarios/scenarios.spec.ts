import pretend from "hubot-pretend"

import {
  mapper,
  Options,
  NumberParameter,
  RegExStringParameter,
  TokenParameter,
  IPv4Parameter,
} from "../../src"
import { expect } from "chai"
import "mocha"

describe("scenarios.spec.ts > wehkamp glitch", () => {
  beforeEach(() => {
    pretend.start()

    var options = new Options()
    options.verbose = false

    mapper(
      pretend.robot,
      {
        name: "wehkamp",
        commands: [
          {
            name: "glitch",
            parameters: [
              new RegExStringParameter(
                "url",
                "https?://",
                "https://wehkamp.nl"
              ),
              new NumberParameter("times", 350),
            ],
            invoke: (tool, robot, res, match, values): void => {
              res.reply(JSON.stringify(values))
            },
          },
          {
            name: "ip",
            parameters: [
              new TokenParameter("source"),
              new IPv4Parameter("sourceIp"),
              new TokenParameter("destination"),
              new IPv4Parameter("destinationIp"),
            ],
            invoke: (tool, robot, res, match, values): void => {
              res.reply(JSON.stringify(values))
            },
          },
        ],
      },
      options
    )
  })

  afterEach(() => pretend.shutdown())

  it("Testing 2 parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch https://google.com 150")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          `@kees {"url":"https://google.com","times":"150"}`
        )
        done()
      })
      .catch(ex => done(ex))
  })

  it("Testing default parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(`@kees {"url":"https://wehkamp.nl","times":350}`)
        done()
      })
      .catch(ex => done(ex))
  })

  it("Testing only 1st parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch https://google.com")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(`@kees {"url":"https://google.com","times":350}`)
        done()
      })
      .catch(ex => done(ex))
  })

  it("Testing only 2nd parameters", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp glitch 70")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(`@kees {"url":"https://wehkamp.nl","times":"70"}`)
        done()
      })
      .catch(ex => done(ex))
  })

  it("Test IPv4", done => {
    pretend
      .user("kees")
      .send("@hubot wehkamp ip source 192.168.1.13 destination 10.0.0.13")
      .then(() => {
        var message = pretend.messages[1][1]
        expect(message).to.eq(
          `@kees {"source":"source","sourceIp":"192.168.1.13","destination":"destination","destinationIp":"10.0.0.13"}`
        )
        done()
      })
      .catch(ex => done(ex))
  })
})
