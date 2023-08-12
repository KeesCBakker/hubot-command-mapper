import { IParameter, ITool } from "../../src"
import { convertCommandIntoRegexString } from "../../src/utils/regex"

export function createToolRegex(parameters: IParameter[], robotName = "hubot", toolName = "test", commandName = "cmd") {
  const tool: ITool = {
    name: toolName,
    commands: [
      {
        name: commandName,
        parameters: parameters,
        execute: () => {}
      }
    ]
  }

  const r = convertCommandIntoRegexString(robotName, null, tool, tool.commands![0])
  return new RegExp(r)
}
