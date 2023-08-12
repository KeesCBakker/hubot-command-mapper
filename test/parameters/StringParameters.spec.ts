import { StringParameter, ChoiceParameter, TokenParameter, IPv4Parameter } from "../../src"

import { RestParameter } from "../../src/index"
import { expect } from "chai"

import { createToolRegex } from "./_parameter-testing"

describe("StringParameters.spec.ts", () => {
  describe("RestParameter", () => {
    it("Single parameter", () => {
      const p = new RestParameter("a")
      const r = createToolRegex([p])
      expect(r.test("hubot test cmd Capture all")).to.be.true
    })
  })

  describe("StringParameter", () => {
    it("Single parameter", () => {
      const p = new StringParameter("a")
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd TestingAWord1337")).to.eql(true, "Word capturing.")
      expect(r.test('hubot test cmd "Testing a multiple 6 word phrase"')).to.eql(true, "Phrase capturing.")
    })

    it("Double parameters", () => {
      const p1 = new StringParameter("a")
      const p2 = new StringParameter("b")
      const r = createToolRegex([p1, p2])

      expect(r.test("hubot test cmd word 'and a phrase'")).to.eql(true, "Word and phrase capture.")
      expect(r.test('hubot test cmd "phrase and" word')).to.eql(true, "Phrase and word capture.")
    })
  })

  describe("ChoiceParameter", () => {
    it("Single parameter", () => {
      const p = new ChoiceParameter("a", ["alpha", "beta", "gamma"])
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd alpha")).to.eql(true, "alpha")
      expect(r.test("hubot test cmd beta")).to.eql(true, "beta")
      expect(r.test("hubot test cmd gamma")).to.eql(true, "gamma")
    })
  })

  describe("IPv4Parameter", () => {
    it("Some IPs", () => {
      const p = new IPv4Parameter("ip")
      const r = createToolRegex([p])

      expect(r.test("hubot test cmd 127.0.0.1")).to.eql(true, "127.0.0.1")
      expect(r.test("hubot test cmd 1.1.1.1")).to.eql(true, "1.1.1.1")
      expect(r.test("hubot test cmd 255.255.255.255")).to.eql(true, "255.255.255.255")
      expect(r.test("hubot test cmd 255.255.255.256")).to.eql(false, "255.255.255.256")
      expect(r.test("hubot test cmd 255.255.255.01")).to.eql(false, "255.255.255.01")
    })

    it("IP prefix", () => {
      const p = new IPv4Parameter("ip")
      const r = createToolRegex([p])

      // good cases
      expect(r.test("hubot test cmd 127.0.0.1/8")).to.eql(true, "127.0.0.1/8")
      expect(r.test("hubot test cmd 127.0.0.1/16")).to.eql(true, "127.0.0.1/16")
      expect(r.test("hubot test cmd 127.0.0.1/24")).to.eql(true, "127.0.0.1/24")
      expect(r.test("hubot test cmd 127.0.0.1/32")).to.eql(true, "127.0.0.1/32")

      // bad cases
      expect(r.test("hubot test cmd 127.0.0.1/0")).to.eql(false, "127.0.0.1/0")
      expect(r.test("hubot test cmd 127.0.0.1/33")).to.eql(false, "127.0.0.1/33")
    })

    it("No prefix", () => {
      const p = new IPv4Parameter("ip", null, false)
      const r = createToolRegex([p])

      // good cases
      expect(r.test("hubot test cmd 127.0.0.1")).to.eql(true, "127.0.0.1")

      // bad cases
      expect(r.test("hubot test cmd 127.0.0.1/8")).to.eql(false, "127.0.0.1/8")
    })
  })

  describe("TokenParameter", () => {
    it("Capture IP using parameters", () => {
      const p = [
        new TokenParameter("source"),
        new IPv4Parameter("sourceIp"),
        new TokenParameter("destination"),
        new IPv4Parameter("destinationIp")
      ]

      const r = createToolRegex(p)

      expect(r.test("hubot test cmd source 127.0.0.1 destination 192.168.1.4")).to.be.true
    })
  })
})
