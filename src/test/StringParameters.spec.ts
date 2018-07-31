import {
  StringParameter,
  ChoiceParameter,
  TokenParameter,
  RegExStringParameter,
  IPv4Parameter
} from "./../parameters/StringParameters";
import { convertCommandIntoRegexString } from "./../regex";

import { mapper, Options, IParameter, RestParameter } from "./../index";
import { expect } from "chai";
import "mocha";
import { createRegex, test } from "./_parameter-testing";

describe("StringParameters.spec.ts", () => {

  describe("RestParameter", () => {

    it("Single parameter", ()=>{
      var p = new RestParameter("a");
      var r = createRegex([p]);
      expect(test(r, "hubot test cmd Capture all", )).to.eq(true);
    });

  })

  describe("StringParameter", () => {

    it("Single parameter", () => {
      var p = new StringParameter("a");
      var r = createRegex([p]);

      expect(test(r, "hubot test cmd TestingAWord1337")).to.eq(
        true,
        "Word capturing."
      );
      expect(
        test(r, 'hubot test cmd "Testing a multiple 6 word phrase"')
      ).to.eq(true, "Phrase capturing.");
    });

    it("Double parameters", () => {
      var p1 = new StringParameter("a");
      var p2 = new StringParameter("b");
      var r = createRegex([p1, p2]);

      expect(test(r, "hubot test cmd word 'and a phrase'")).to.eq(
        true,
        "Word and phrase capture."
      );
      expect(test(r, 'hubot test cmd "phrase and" word')).to.eq(
        true,
        "Phrase and word capture."
      );
    });
  });

  describe("ChoiceParameter", () => {
    it("Single parameter", () => {
      var p = new ChoiceParameter("a", ["alpha", "beta", "gamma"]);
      var r = createRegex([p]);

      expect(test(r, "hubot test cmd alpha")).to.eq(true, "alpha");
      expect(test(r, "hubot test cmd beta")).to.eq(true, "beta");
      expect(test(r, "hubot test cmd gamma")).to.eq(true, "gamma");
    });
  });

  describe("TokenParameter", ()=>{
    it.only("Capture IP using parameters", ()=>{

      var p = [
        new TokenParameter("source"),
        new IPv4Parameter("sourceIp"),
        new TokenParameter("destination"),
        new IPv4Parameter("destinationIp")
      ];

      var r =createRegex(p);
      console.log(r);

      expect(test(r, "hubot cmd source 127.0.0.1 destination 192.168.1.4")).to.eq(true);
    });
  });
});
