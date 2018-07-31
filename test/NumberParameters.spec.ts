import { NumberParameter, NumberStyle, FractionParameter } from "./../src/parameters/NumberParameters";
import { expect } from "chai";
import "mocha";
import { createRegex, test } from "./_parameter-testing";

describe("NumberParameters.param.spec.ts / Default commands", () => {

  describe("NumberParameter", () => {

    it("Single Parameter", () => {
      var p = new NumberParameter("a");
      var r = createRegex([p]);

      expect(test(r, "hubot test cmd -10")).to.eq(true, "Negative number.");
      expect(test(r, "hubot test cmd 1337")).to.eq(true, "Positive number.");
    });

    it("Positive Parameter", () => {
      var p = new NumberParameter("a", null, NumberStyle.Positive);
      var r = createRegex([p]);

      expect(test(r, "hubot test cmd 10")).to.eq(true, "Positive number.");
      expect(test(r, "hubot test cmd -10")).to.eq(false, "Negative number.");
    });

    it("Negative Parameter", () => {
      var p = new NumberParameter("a", null, NumberStyle.Negative);
      var r = createRegex([p]);

      expect(test(r, "hubot test cmd 10")).to.eq(false, "Positive number.");
      expect(test(r, "hubot test cmd -10")).to.eq(true, "Negative number.");
    });

    it("Double Parameter", () => {
      var p1 = new NumberParameter("a");
      var p2 = new NumberParameter("b");
      var r = createRegex([p1, p2]);

      expect(test(r, "hubot test cmd -10 1337")).to.eq(
        true,
        "Negative number followed by a positive number."
      );
      expect(test(r, "hubot test cmd 1337 -10")).to.eq(
        true,
        "Positive number followed by a negative number."
      );
    });
  });

  describe("FractionParameter", () => {

    it("Single Parameter", () => {
        var p = new FractionParameter("a");
        var r = createRegex([p]);
  
        expect(test(r, "hubot test cmd -10.144")).to.eq(true, "Negative number.");
        expect(test(r, "hubot test cmd 1337.28")).to.eq(true, "Positive number.");          
    });

  });

});
