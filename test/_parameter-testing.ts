import { IParameter, ITool } from "../src";
import { convertCommandIntoRegexString } from "../src/utils/regex";

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

export function delay(ms, val){
  return new Promise(r => {
    setTimeout(()=>{
      r(val);
    }, ms);
  });
}