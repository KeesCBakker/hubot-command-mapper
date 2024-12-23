import NamedRegExp from "named-regexp-groups"
import { ITool, ICommand } from "../../types.mjs"
import { convertCommandIntoRegexString } from "../../utils/regex.mjs"

export function getValues(
  robotName: string,
  robotAlias: string,
  tool: ITool,
  command: ICommand,
  message: string
): Record<string, any> {
  let collection: Record<string, any> = {}

  if (command.parameters) {
    let r = convertCommandIntoRegexString(robotName, robotAlias, tool, command, true)
    let nr = new NamedRegExp(r, "si")

    let answer = nr.exec(message).groups

    for (let parameter of command.parameters) {
      let value = answer[parameter.name]
      if (value == null) {
        value = parameter.defaultValue
      }
      collection[parameter.name] = value
    }
  }

  return collection
}
