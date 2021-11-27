import { IParameter } from "../definitions/IParameter"
import { ITool } from "../definitions/ITool"
import { IOptions, defaultOptions } from "../entities/options"
import { IParameterValueCollection } from "../definitions/IParameterValueCollection"
import { map_tool } from "./map_tool"
import { ICallback } from "../definitions/ICallback"
import { IContext } from "../definitions/IContext"

export function map_command(
  robot: Hubot.Robot,
  command: string,
  args: (IParameter | ICallback | IOptions)[]
): void {
  let callback = args.find(a => a instanceof Function) as ICallback
  if (!callback) throw "Missing callback function."

  let parameters = args.filter(a => (a as IParameter).name) as IParameter[]
  let options =
    (args.find(
      a =>
        (a as IOptions).addDebugCommand ||
        (a as IOptions).addHelpCommand ||
        (a as IOptions).verbose
    ) as IOptions) || defaultOptions

  let tool = {
    name: command,
    commands: [
      {
        name: "cmd",
        parameters: parameters,
        alias: [""],
        invoke: (
          tool: ITool,
          robot: Hubot.Robot,
          res: Hubot.Response,
          match: RegExpMatchArray,
          values: IParameterValueCollection
        ) => {
          var context = {
            tool: tool,
            robot: robot,
            res: res,
            match: match,
            values: values,
          } as IContext

          callback(context)
        },
      },
    ],
  } as ITool

  map_tool(robot, tool, options)
}
