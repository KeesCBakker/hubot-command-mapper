const pretend = require("hubot-pretend");
import { expect } from "chai";
import "mocha";
import { hasSwitch, setSwitch } from '../../src/utils/switches';

describe("switches.spec.ts / switches", () => {

  const SWITCH = "SOME_SWITCH_NAME";

  beforeEach(() => {
    pretend.start();
  });

  afterEach(() => pretend.shutdown());

  it("No parameters set should return false.", done => {
    expect(hasSwitch(pretend.robot, SWITCH)).to.eql(false);
    done();
  });

  it("Setting a parameter should return true.", done => {
    setSwitch(pretend.robot, SWITCH);
    expect(hasSwitch(pretend.robot, SWITCH)).to.eql(true);
    done();
  });

});
