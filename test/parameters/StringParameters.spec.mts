import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { RestParameter, StringParameter, ChoiceParameter, IPv4Parameter, TokenParameter } from "../../src/index.mjs"
import { createRegex, test } from "../_parameter-testing.mjs"

describe("StringParameters.spec.ts", () => {
  describe("RestParameter", () => {
    it("Single parameter", () => {
      var p = new RestParameter("a")
      var r = createRegex([p])
      assert.equal(test(r, "hubot test cmd Capture all"), true)
    })

    it("Multi line parameter", () => {
      var p = new RestParameter("a")
      var r = createRegex([p])
      assert.equal(test(r, "hubot test cmd Capture all\nnew lines\n"), true)
    })
  })

  describe("StringParameter", () => {
    it("Single parameter", () => {
      var p = new StringParameter("a")
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd TestingAWord1337"), true, "Word capturing.")
      assert.equal(test(r, 'hubot test cmd "Testing a multiple 6 word phrase"'), true, "Phrase capturing.")
    })

    it("Double parameters", () => {
      var p1 = new StringParameter("a")
      var p2 = new StringParameter("b")
      var r = createRegex([p1, p2])

      assert.equal(test(r, "hubot test cmd word 'and a phrase'"), true, "Word and phrase capture.")
      assert.equal(test(r, 'hubot test cmd "phrase and" word'), true, "Phrase and word capture.")
    })
  })

  describe("ChoiceParameter", () => {
    it("Single parameter", () => {
      var p = new ChoiceParameter("a", ["alpha", "beta", "gamma"])
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd alpha"), true, "alpha")
      assert.equal(test(r, "hubot test cmd beta"), true, "beta")
      assert.equal(test(r, "hubot test cmd gamma"), true, "gamma")
    })
  })

  describe("IPv4Parameter", () => {
    it("Some IPs", () => {
      var p = new IPv4Parameter("ip")
      var r = createRegex([p])

      assert.equal(test(r, "hubot test cmd 127.0.0.1"), true, "127.0.0.1")
      assert.equal(test(r, "hubot test cmd 1.1.1.1"), true, "1.1.1.1")
      assert.equal(test(r, "hubot test cmd 255.255.255.255"), true, "255.255.255.255")
      assert.equal(test(r, "hubot test cmd 255.255.255.256"), false, "255.255.255.256")
      assert.equal(test(r, "hubot test cmd 255.255.255.01"), false, "255.255.255.01")
    })

    it("IP prefix", () => {
      var p = new IPv4Parameter("ip")
      var r = createRegex([p])

      // good cases
      assert.equal(test(r, "hubot test cmd 127.0.0.1/8"), true, "127.0.0.1/8")
      assert.equal(test(r, "hubot test cmd 127.0.0.1/16"), true, "127.0.0.1/16")
      assert.equal(test(r, "hubot test cmd 127.0.0.1/24"), true, "127.0.0.1/24")
      assert.equal(test(r, "hubot test cmd 127.0.0.1/32"), true, "127.0.0.1/32")

      // bad cases
      assert.equal(test(r, "hubot test cmd 127.0.0.1/0"), false, "127.0.0.1/0")
      assert.equal(test(r, "hubot test cmd 127.0.0.1/33"), false, "127.0.0.1/33")
    })

    it("No prefix", () => {
      var p = new IPv4Parameter("ip", null, false)
      var r = createRegex([p])

      // good cases
      assert.equal(test(r, "hubot test cmd 127.0.0.1"), true, "127.0.0.1")

      // bad cases
      assert.equal(test(r, "hubot test cmd 127.0.0.1/8"), false, "127.0.0.1/8")
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

      assert.equal(test(r, "hubot test cmd source 127.0.0.1 destination 192.168.1.4"), true)
    })
  })
})
