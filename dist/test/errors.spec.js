"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("./../mapper");
const chai_1 = require("chai");
require("mocha");
const mocked_bot_1 = require("./mocks/mocked-bot");
describe("Errors", () => {
    it("No robot", done => {
        try {
            mapper_1.default(null, null);
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Argument 'robot' is empty.");
            done();
        }
    });
    it("No tool", done => {
        try {
            mapper_1.default(new mocked_bot_1.default("Kees"), null);
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Argument 'tool' is empty.");
            done();
        }
    });
    it("Invalid tool name due to null", done => {
        try {
            mapper_1.default(new mocked_bot_1.default("Kees"), {
                name: null,
                commands: []
            });
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Invalid name for tool.");
            done();
        }
    });
    it("Invalid tool name due to empty string", done => {
        try {
            mapper_1.default(new mocked_bot_1.default("Kees"), {
                name: "",
                commands: []
            });
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Invalid name for tool.");
            done();
        }
    });
    it("Invalid tool due to empty command name", done => {
        try {
            mapper_1.default(new mocked_bot_1.default("Kees"), {
                name: "Test",
                commands: [
                    {
                        name: "",
                        invoke: (tool, robot, res) => { }
                    }
                ]
            });
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Invalid command name.");
            done();
        }
    });
    it("Invalid tool due to null command name", done => {
        try {
            mapper_1.default(new mocked_bot_1.default("Kees"), {
                name: "Test",
                commands: [
                    {
                        name: null,
                        invoke: (tool, robot, res) => { }
                    }
                ]
            });
        }
        catch (ex) {
            chai_1.expect(ex.toString()).to.eq("Invalid command name.");
            done();
        }
    });
});
