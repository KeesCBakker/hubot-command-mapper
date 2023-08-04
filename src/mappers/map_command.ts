import { IOptions, defaultOptions } from "../entities/options"
import { IParameter, ICallback, ITool } from "../types"
import { map_tool } from "./map_tool"

export function map_command(robot: Hubot.Robot, command: string, args: (IParameter | ICallback | IOptions)[]): void {
  let callback = args.find(a => a instanceof Function) as ICallback
  if (!callback) throw "Missing callback function."

  let parameters = args.filter(a => (a as IParameter).name) as IParameter[]
  let options =
    (args.find(
      a =>
        (a as IOptions).addDebugCommand ||
        (a as IOptions).addHelpCommand ||
        (a as IOptions).invalidSyntaxHelpPrefix ||
        (a as IOptions).invalidSyntaxMessage ||
        (a as IOptions).notAuthorizedMessage ||
        (a as IOptions).replacedByBot ||
        (a as IOptions).showHelpOnInvalidSyntax ||
        (a as IOptions).showInvalidSyntax
    ) as IOptions) || defaultOptions

  let tool = {
    name: command,
    commands: [
      {
        name: "cmd",
        parameters: parameters,
        alias: [""],
        execute: context => callback(context)
      }
    ]
  } as ITool

  map_tool(robot, tool, options)
}
