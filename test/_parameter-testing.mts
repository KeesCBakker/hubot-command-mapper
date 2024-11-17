import { IParameter, ITool } from "../src/types.mjs"
import { convertCommandIntoRegexString } from "../src/utils/regex.mjs"

export function test(regex: string, dataToTest: string) {
  var r = new RegExp(regex, "si")
  return r.test(dataToTest)
}

export function exec(regex: string, dataToTest: string) {
  var r = new RegExp(regex, "si")
  return r.exec(dataToTest)
}

export function createRegex(parameters: IParameter[], robotName = "hubot", toolName = "test", commandName = "cmd") {
  let tool: ITool = {
    name: toolName,
    commands: [
      {
        name: commandName,
        parameters: parameters,
        execute: _ => {}
      }
    ]
  }

  return convertCommandIntoRegexString(robotName, null, tool, tool.commands![0])
}

export function delay<T>(ms: number, val: T) {
  return new Promise<T>(r => {
    setTimeout(() => {
      r(val)
    }, ms)
  })
}
