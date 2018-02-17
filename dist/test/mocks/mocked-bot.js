"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strongly_typed_events_1 = require("strongly-typed-events");
class MockedBot {
    constructor(name) {
        this.name = name;
        this.alias = "";
        this._replies = new strongly_typed_events_1.EventDispatcher();
        this._listeners = new Array();
    }
    get onReply() {
        return this._replies.asEvent();
    }
    helpCommands() {
        return new Array();
    }
    loadFile(path, fileName) { }
    respond(regex, onRespond) {
        this._listeners.push({
            regex: regex,
            respond: onRespond
        });
    }
    receive(msg, userName, userId) {
        let res = {
            reply: msg => this._replies.dispatch(this, msg),
            message: {
                text: msg,
                user: {
                    name: userName,
                    id: userId
                }
            }
        };
        this._listeners.forEach(l => {
            if (l.regex.test(msg)) {
                l.respond(res);
            }
        });
    }
}
exports.default = MockedBot;
