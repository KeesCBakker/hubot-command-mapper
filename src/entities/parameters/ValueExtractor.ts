import { convertCommandIntoRegexString } from "../../utils/regex"
import { IParameterValueCollection, ICommand, ITool, IMap } from "../../definitions"

import NamedRegExp from "named-regexp-groups"

export function getValues(
  robotName: string,
  robotAlias: string,
  tool: ITool,
  command: ICommand,
  message: string
): IParameterValueCollection {
  let collection: IMap = {}

  if (command.parameters) {
    let r = convertCommandIntoRegexString(robotName, robotAlias, tool, command, true)
    let nr = new NamedRegExp(r, "i")

    let answer = nr.exec(message).groups

    for (let parameter of command.parameters) {
      let value = answer[parameter.name]
      if (value == null) {
        value = parameter.defaultValue
      }
      collection[parameter.name] = value
    }
  }

  return collection as IParameterValueCollection
}
