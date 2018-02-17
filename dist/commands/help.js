"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHelpCommand() {
    return {
        name: "help",
        alias: ["?", "/?", "--help"],
        invoke: (tool, robot, res, match, helpMsgPrefix, noHelpMsg) => {
            const botName = "@" + (robot.alias || robot.name);
            let helpCommands = robot
                .helpCommands()
                .filter(cmd => cmd.startsWith("hubot " + tool.name))
                .map(cmd => cmd.replace(/hubot/g, botName));
            helpCommands.sort();
            if (helpCommands.length == 0) {
                if (noHelpMsg) {
                    res.reply(noHelpMsg);
                    return;
                }
                res.reply(`the tool _${tool.name}_ has no help.`);
                return;
            }
            if (!helpMsgPrefix) {
                helpMsgPrefix = `the tool _${tool.name}_ has the following commands:\n- `;
            }
            let msg = helpMsgPrefix + helpCommands.join("\n- ");
            res.reply(msg);
        }
    };
}
exports.default = createHelpCommand;
