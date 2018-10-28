import { convertCommandIntoRegexString } from "../../utils/regex";
import { IParameterValueCollection } from "../../definitions/IParameterValueCollection";
import { isUndefined } from "util";
import { ITool, ICommand } from "../..";

const NamedRegExp = require("named-regexp-groups");

export function getValues(robotName: string, tool: ITool, command: ICommand, messsage: string): IParameterValueCollection {
  let collection = {};

  if (command.parameters) {
    let r = convertCommandIntoRegexString(robotName, tool, command, true);
    let nr = new NamedRegExp(r, "i");

    let answer = nr.exec(messsage).groups;

    for (let parameter of command.parameters) {
      let value = answer[parameter.name];
      if (isUndefined(value)) {
        value = parameter.defaultValue;
      }
      collection[parameter.name] = value;
    }
  }

  return collection;
}
