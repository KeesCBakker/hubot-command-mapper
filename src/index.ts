import { addDiagnosticsMiddleware } from "./middleware/addDiagnosticsMiddleware"
import { alias as _alias } from "./mappers/alias"
import { AnyParameter } from "./entities/parameters/AnyParameter"
import { ChoiceParameter } from "./entities/parameters/ChoiceParameter"
import { defaultOptions, IOptions, Options } from "./entities/options"
import { FractionParameter } from "./entities/parameters/FractionParameter"
import { FractionStyle } from "./entities/parameters/FractionStyle"
import { ICallback, ICommand, ICommandResolverResultDebugInfo, IContext, IParameter, ITool } from "./types"
import { IPv4Parameter } from "./entities/parameters/IPv4Parameter"
import { map_command as _map_command } from "./mappers/map_command"
import { map_default_alias } from "./mappers/map_default_alias"
import { map_tool as _map_tool } from "./mappers/map_tool"
import { NumberParameter } from "./entities/parameters/NumberParameter"
import { NumberStyle } from "./entities/parameters/NumberStyle"
import { RegExParameter, RegExStringParameter } from "./entities/parameters/RegExStringParameter"
import { removeMarkdownFromIncomingMessages } from "./middleware/removeMarkdownFromIncomingMessages"
import { removeTrailingBotWhitespaceCharactersFromIncomingMessages } from "./middleware/removeTrailingBotWhitespaceCharactersFromIncomingMessages"
import { removeTrailingWhitespaceCharactersFromIncomingMessages } from "./middleware/removeTrailingWhitespaceCharactersFromIncomingMessages"
import { RestParameter } from "./entities/parameters/RestParameter"
import { StringParameter } from "./entities/parameters/StringParameter"
import { TokenParameter } from "./entities/parameters/TokenParameter"

export {
  IParameter,
  NumberParameter,
  NumberStyle,
  FractionParameter,
  FractionStyle,
  RestParameter,
  AnyParameter,
  StringParameter,
  ChoiceParameter,
  RegExStringParameter,
  RegExParameter,
  TokenParameter,
  IPv4Parameter,
  IOptions,
  Options,
  defaultOptions,
  ITool,
  ICommand,
  ICallback,
  IContext,
  ICommandResolverResultDebugInfo,
  removeTrailingWhitespaceCharactersFromIncomingMessages,
  removeTrailingBotWhitespaceCharactersFromIncomingMessages,
  removeMarkdownFromIncomingMessages,
  addDiagnosticsMiddleware,
  map_default_alias
}

/**
 * Maps the specified tool to the Robot.
 *
 * @export
 * @param {NodeModule} caller The caller.
 * @param {NodeModule} packageModule The package module.
 * @param {IRobot} robot The robot.
 * @param {ITool} tool The tool that will be mapped.
 * @param {IOptions} [options] The options for this specific mapping.
 */
export function mapper(robot: Hubot.Robot, tool: ITool, options: IOptions = defaultOptions) {
  _map_tool(robot, tool, options)
}

/**
 * Creates a mapping for a single command.
 *
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {string} command The command.
 * @param {(...(IParameter | ICallback | IOptions)[])} args You can specify parameters, the callback and options here.
 */
export function map_command(robot: Hubot.Robot, command: string, ...args: (IParameter | ICallback | IOptions)[]): void {
  _map_command(robot, command, args)
}

/**
 * Maps the specified tool to the Robot.
 *
 * @param robot The robot.
 * @param tool The tool.
 * @param options The options.
 */
export function map_tool(robot: Hubot.Robot, tool: ITool, options: IOptions = defaultOptions) {
  mapper(robot, tool, options)
}

/**
 * Maps a list of alias commands to the Robot.
 *
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {*} map An object with keys and redirects.
 * @param {IOptions} [options=defaultOptions] The options.
 */
export function alias(robot: Hubot.Robot, map: any): void {
  _alias(robot, map)
}
