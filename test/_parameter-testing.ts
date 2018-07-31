import { IParameter } from "./../src/parameters/Base";
import { convertCommandIntoRegexString } from "./../src/regex";
import { ITool } from "./../src/tool";

export function test(regex: string, dataToTest: string) {
  var r = new RegExp(regex, "i");
  return r.test(dataToTest);
}

export function createRegex(
  parameters: IParameter[],
  robotName = "hubot",
  toolName = "test",
  commandName = "cmd"
) {
  let tool: ITool = {
    name: toolName,
    commands: [
      {
        name: commandName,
        parameters: parameters,
        invoke: () => {}
      }
    ]
  };

  return convertCommandIntoRegexString(robotName, tool, tool.commands[0]);
}