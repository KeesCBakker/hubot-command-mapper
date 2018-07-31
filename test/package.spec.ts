import { expect } from "chai";
import "mocha";

import { mapper } from "./../src/";

describe("package.spec.ts / Package", () => {
  it("index.js", () => {
    expect(mapper).to.be.not.null;
    expect(mapper).to.be.a("function");
  });
});
