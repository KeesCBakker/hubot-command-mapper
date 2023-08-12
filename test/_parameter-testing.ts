import { IParameter, ITool } from "../src"
import { convertCommandIntoRegexString } from "../src/utils/regex"

export function test(regex: string, dataToTest: string) {
  const r = new RegExp(regex, "i")
  return r.test(dataToTest)
}

export function exec(regex: string, dataToTest: string) {
  const r = new RegExp(regex, "i")
  return r.exec(dataToTest)
}

export function createRegex(parameters: IParameter[], robotName = "hubot", toolName = "test", commandName = "cmd") {
  const tool: ITool = {
    name: toolName,
    commands: [
      {
        name: commandName,
        parameters: parameters,
        execute: () => {}
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
