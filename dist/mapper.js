"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./validation");
const debug_1 = require("./commands/debug");
const reload_1 = require("./commands/reload");
const help_1 = require("./commands/help");
const regex_1 = require("./regex");
//needed for reload - otherwise the caller value will be cached
const caller = module.parent;
delete require.cache[__filename];
/**
 * Maps the specified tool to the Robot.
 *
 * @export
 * @param {IRobot} robot
 * @param {ITool} tool
 * @param {boolean} [verbose=true] Indicates if the tool should be verbose echoing details to the console log.
 */
function mapper(robot, tool, verbose = true) {
    if (!robot)
        throw "Argument 'robot' is empty.";
    if (!tool)
        throw "Argument 'tool' is empty.";
    validation_1.default(tool);
    //add a debug command
    tool.registrations = [];
    tool.commands.push(debug_1.default());
    //add a reload command
    tool.commands.push(reload_1.default(caller, verbose));
    //add help
    const helpCommand = help_1.default();
    tool.commands.push(helpCommand);
    //init every command
    tool.commands.forEach(cmd => {
        //use a second validation regex to confirm the message we
        //are responding to, is as we expected. This will prevent command
        //match edge cases in which certain phrases end with a command name
        const strValidationRegex = regex_1.convertCommandIntoRegexString(robot.name, tool, cmd);
        cmd.validationRegex = new RegExp(strValidationRegex, "i");
        if (verbose) {
            console.log(`Mapping '${tool.name}.${cmd.name}' as '${strValidationRegex}'.`);
        }
        //needed for the debug command
        tool.registrations.push({
            commandName: cmd.name,
            messageRegex: strValidationRegex
        });
    });
    //listen for invocation of tool
    const toolRegexString = regex_1.convertToolIntoRegexString(tool);
    const toolRegex = new RegExp(toolRegexString, "i");
    robot.respond(toolRegex, res => {
        //don't do anything with muted tools. They are here as
        //part of a reload.
        if (tool.mute) {
            return;
        }
        const msg = res.message.text;
        const matchingCommands = tool.commands.filter(cmd => cmd.validationRegex.test(msg));
        //if no commands matched, show help command
        if (matchingCommands.length == 0) {
            let msg = "sorry, I don't understand. Maybe you could try: \n- ";
            let msg2 = "invalid syntax.";
            helpCommand.invoke(tool, robot, res, null, msg, msg2);
            return;
        }
        const cmd = matchingCommands[0];
        let authorized = (!tool.auth || tool.auth.indexOf(res.message.user.name) > -1) &&
            (!cmd.auth || cmd.auth.indexOf(res.message.user.name) > -1);
        var match = cmd.validationRegex.exec(msg);
        if (verbose) {
            var debug = {
                User: res.message.user.name,
                UserId: res.message.user.id,
                Authorized: authorized,
                Text: res.message.text,
                Tool: tool.name,
                Command: cmd.name,
                Match: match
            };
            console.log(debug);
        }
        if (!authorized) {
            res.reply("sorry, you are not authorized to use this command.");
            return;
        }
        cmd.invoke(tool, robot, res, match);
    });
}
exports.default = mapper;
