import { StringParameter, ChoiceParameter, TokenParameter, IPv4Parameter } from "../../src"

import { RestParameter } from "../../src/index"
import { expect } from "chai"

import { createRegex, test } from "../_parameter-testing"

describe("StringParameters.spec.ts", () => {
  describe("RestParameter", () => {
    it("Single parameter", () => {
      var p = new RestParameter("a")
      var r = createRegex([p])
      expect(test(r, "hubot test cmd Capture all")).to.eq(true)
    })

    it("Multi line parameter", () => {
      var p = new RestParameter("a")
      var r = createRegex([p])
      expect(test(r, "hubot test cmd Capture all\nnew lines\n")).to.eq(true)
    })
  })

  describe("StringParameter", () => {
    it("Single parameter", () => {
      var p = new StringParameter("a")
      var r = createRegex([p])

      expect(test(r, "hubot test cmd TestingAWord1337")).to.eq(true, "Word capturing.")
      expect(test(r, 'hubot test cmd "Testing a multiple 6 word phrase"')).to.eq(true, "Phrase capturing.")
    })

    it("Double parameters", () => {
      var p1 = new StringParameter("a")
      var p2 = new StringParameter("b")
      var r = createRegex([p1, p2])

      expect(test(r, "hubot test cmd word 'and a phrase'")).to.eq(true, "Word and phrase capture.")
      expect(test(r, 'hubot test cmd "phrase and" word')).to.eq(true, "Phrase and word capture.")
    })
  })

  describe("ChoiceParameter", () => {
    it("Single parameter", () => {
      var p = new ChoiceParameter("a", ["alpha", "beta", "gamma"])
      var r = createRegex([p])

      expect(test(r, "hubot test cmd alpha")).to.eq(true, "alpha")
      expect(test(r, "hubot test cmd beta")).to.eq(true, "beta")
      expect(test(r, "hubot test cmd gamma")).to.eq(true, "gamma")
    })
  })

  describe("IPv4Parameter", () => {
    it("Some IPs", () => {
      var p = new IPv4Parameter("ip")
      var r = createRegex([p])

      expect(test(r, "hubot test cmd 127.0.0.1")).to.eq(true, "127.0.0.1")
      expect(test(r, "hubot test cmd 1.1.1.1")).to.eq(true, "1.1.1.1")
      expect(test(r, "hubot test cmd 255.255.255.255")).to.eq(true, "255.255.255.255")
      expect(test(r, "hubot test cmd 255.255.255.256")).to.eq(false, "255.255.255.256")
      expect(test(r, "hubot test cmd 255.255.255.01")).to.eq(false, "255.255.255.01")
    })

    it("IP prefix", () => {
      var p = new IPv4Parameter("ip")
      var r = createRegex([p])

      // good cases
      expect(test(r, "hubot test cmd 127.0.0.1/8")).to.eq(true, "127.0.0.1/8")
      expect(test(r, "hubot test cmd 127.0.0.1/16")).to.eq(true, "127.0.0.1/16")
      expect(test(r, "hubot test cmd 127.0.0.1/24")).to.eq(true, "127.0.0.1/24")
      expect(test(r, "hubot test cmd 127.0.0.1/32")).to.eq(true, "127.0.0.1/32")

      // bad cases
      expect(test(r, "hubot test cmd 127.0.0.1/0")).to.eq(false, "127.0.0.1/0")
      expect(test(r, "hubot test cmd 127.0.0.1/33")).to.eq(false, "127.0.0.1/33")
    })

    it("No prefix", () => {
      var p = new IPv4Parameter("ip", null, false)
      var r = createRegex([p])

      // good cases
      expect(test(r, "hubot test cmd 127.0.0.1")).to.eq(true, "127.0.0.1")

      // bad cases
      expect(test(r, "hubot test cmd 127.0.0.1/8")).to.eq(false, "127.0.0.1/8")
    })
  })

  describe("TokenParameter", () => {
    it("Capture IP using parameters", () => {
      var p = [
        new TokenParameter("source"),
        new IPv4Parameter("sourceIp"),
        new TokenParameter("destination"),
        new IPv4Parameter("destinationIp")
      ]

      var r = createRegex(p)

      expect(test(r, "hubot test cmd source 127.0.0.1 destination 192.168.1.4")).to.eq(true)
    })
  })
})
