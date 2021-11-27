import { ITool, ICommand } from "../definitions"

/**
 * Validates the tool and throws and exception if the
 * tool is invalid.
 * @param tool The tool.
 */
export default function validateToolAndThrowWhenInvalid(tool: ITool): void {
  if (!tool.name || tool.name === "") throw "Invalid name for tool."

  if (!tool.commands || !tool.commands.length)
    throw `No commands found for "${tool.name}"`

  tool.commands.forEach(cmd => validateCommandAndThrowWhenInvalid(tool, cmd))
}

/**
 * Validates the command and throws an exception if
 * the command is invalid.
 * @param tool The tool.
 * @param cmd The command.
 */
export function validateCommandAndThrowWhenInvalid(tool: ITool, cmd: ICommand) {
  if (!cmd) throw "Cannot map empty command."

  if (!cmd.name || cmd.name === "") throw "Invalid command name."

  //validate if the command is registered only once
  if (
    tool.commands.filter(
      c =>
        c != cmd &&
        (c.name == cmd.name || (c.alias && c.alias.indexOf(cmd.name) != -1))
    ).length > 0
  )
    throw `Cannot create command '${cmd.name}' for tool '${tool.name}'. Multiple commands with the same name or alias found.`
}
