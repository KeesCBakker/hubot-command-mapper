import { IParameter } from "../parameters/Base";
import { convertCommandIntoRegexString } from "../regex";

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
  let tool: ITool<void> = {
    name: toolName,
    commands: [
      {
        name: commandName,
        parameters: parameters
      }
    ]
  };

  return convertCommandIntoRegexString(robotName, tool, tool.commands[0]);
}
