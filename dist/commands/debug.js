"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDebugCommand() {
    return {
        name: "debug",
        invoke: (tool, robot, res, match) => {
            let msg = `The tool "${tool.name}" uses the following commands:`;
            tool.registrations.forEach(r => (msg += `\n- ${r.commandName}: ${r.messageRegex}`));
            res.reply(msg);
        }
    };
}
exports.default = createDebugCommand;
