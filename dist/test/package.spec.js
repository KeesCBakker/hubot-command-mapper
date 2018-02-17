"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const _1 = require("./../");
describe("Package", () => {
    it("index.js", () => {
        chai_1.expect(_1.default).to.be.not.null;
        chai_1.expect(_1.default).to.be.a("function");
    });
});
