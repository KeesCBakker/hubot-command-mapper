import { ITool, ICommand, ValueMap } from "../../types"
import { convertCommandIntoRegexString } from "../../utils/regex"

import NamedRegExp from "named-regexp-groups"

export function getValues(
  robotName: string,
  robotAlias: string,
  tool: ITool,
  command: ICommand,
  message: string
): ValueMap {
  const collection: ValueMap = {}

  if (command.parameters) {
    const r = convertCommandIntoRegexString(robotName, robotAlias, tool, command, true)
    const nr = new NamedRegExp(r, "i")

    const answer = nr.exec(message).groups

    for (const parameter of command.parameters) {
      let value: unknown = answer[parameter.name]
      if (value == null) {
        value = parameter.defaultValue
      }
      collection[parameter.name] = value
    }
  }

  return collection
}
