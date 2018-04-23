import { convertCommandIntoRegexString } from "../regex";
import { IParameterValueCollection, IParameter } from "./Base";
import { isUndefined } from "util";
import { ITool } from "../tool";
import { ICommand } from "../commands/commmand";

const NamedRegExp = require("named-regexp-groups");

export function getValues<A>(
  robotName: string,
  tool: ITool<A>,
  command: ICommand<A>,
  messsage: string
): IParameterValueCollection {
  let collection = {};

  if (command.parameters) {
    let r = convertCommandIntoRegexString(robotName, tool, command, true);
    let nr = new NamedRegExp(r);

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
