import { convertCommandIntoRegexString } from "../regex";
import { IParameterValueCollection } from "./IParameterValueCollection";
import { isUndefined } from "util";
import { ITool } from "../ITool";
import { ICommand } from "../commands/ICommand";

const NamedRegExp = require("named-regexp-groups");

export function getValues<A>(robotName: string, tool: ITool, command: ICommand, messsage: string): IParameterValueCollection {
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
