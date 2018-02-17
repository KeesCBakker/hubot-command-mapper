"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateTool(tool) {
    if (!tool.name || tool.name === "")
        throw "Invalid name for tool.";
    if (!tool.commands || !tool.commands.length)
        throw `No commands found for "${tool.name}"`;
    tool.commands.forEach(cmd => validateCommand(tool, cmd));
}
exports.default = validateTool;
function validateCommand(tool, cmd) {
    if (!cmd)
        throw "Cannot map empty command.";
    if (!cmd.name || cmd.name === "")
        throw "Invalid command name.";
    //validate if the command is registered only once
    if (tool.commands.filter(c => c != cmd &&
        (c.name == cmd.name || (c.alias && c.alias.indexOf(cmd.name) != -1))).length > 0)
        throw `Cannot create command '${cmd.name}'. Multiple commands with the same name or alias found.`;
}
exports.validateCommand = validateCommand;
