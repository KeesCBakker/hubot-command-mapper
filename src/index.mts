import { Robot } from "hubot"
import { IOptions, Options, defaultOptions } from "./entities/options.mjs"
import { AnyParameter } from "./entities/parameters/AnyParameter.mjs"
import { ChoiceParameter } from "./entities/parameters/ChoiceParameter.mjs"
import { FractionParameter } from "./entities/parameters/FractionParameter.mjs"
import { FractionStyle } from "./entities/parameters/FractionStyle.mjs"
import { IPv4Parameter } from "./entities/parameters/IPv4Parameter.mjs"
import { NumberParameter } from "./entities/parameters/NumberParameter.mjs"
import { NumberStyle } from "./entities/parameters/NumberStyle.mjs"
import { RegExStringParameter, RegExParameter } from "./entities/parameters/RegExStringParameter.mjs"
import { RestParameter } from "./entities/parameters/RestParameter.mjs"
import { StringParameter } from "./entities/parameters/StringParameter.mjs"
import { TokenParameter } from "./entities/parameters/TokenParameter.mjs"
import { map_default_alias } from "./mappers/map_default_alias.mjs"
import { addDiagnosticsMiddleware } from "./middleware/addDiagnosticsMiddleware.mjs"
import { removeMarkdownFromIncomingMessages } from "./middleware/removeMarkdownFromIncomingMessages.mjs"
import { removeTrailingBotWhitespaceCharactersFromIncomingMessages } from "./middleware/removeTrailingBotWhitespaceCharactersFromIncomingMessages.mjs"
import { removeTrailingWhitespaceCharactersFromIncomingMessages } from "./middleware/removeTrailingWhitespaceCharactersFromIncomingMessages.mjs"
import { IParameter, ITool, ICommand, ICallback, IContext, ICommandResolverResultDebugInfo } from "./types.mjs"

import { map_tool as _map_tool } from "./mappers/map_tool.mjs"
import { map_command as _map_command } from "./mappers/map_command.mjs"
import { alias as _alias } from "./mappers/alias.mjs"

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
 * @param {IRobot} robot The robot.
 * @param {ITool} tool The tool that will be mapped.
 * @param {IOptions} [options] The options for this specific mapping.
 */
export function mapper(robot: Robot, tool: ITool, options: IOptions = defaultOptions) {
  _map_tool(robot, tool, options)
}

/**
 * Creates a mapping for a single command.
 *
 * @export
 * @param {Robot} robot The robot.
 * @param {string} command The command.
 * @param {(...(IParameter | ICallback | IOptions)[])} args You can specify parameters, the callback and options here.
 */
export function map_command(robot: Robot, command: string, ...args: (IParameter | ICallback | IOptions)[]): void {
  _map_command(robot, command, args)
}

/**
 * Maps the specified tool to the Robot.
 *
 * @param {Robot} robot The robot.
 * @param {ITool} map The tool.
 * @param {IOptions} [options=defaultOptions] The options.
 */
export function map_tool(robot: Robot, tool: ITool, options: IOptions = defaultOptions) {
  mapper(robot, tool, options)
}

/**
 * Maps a list of alias commands to the Robot.
 *
 * @export
 * @param {Robot} robot The robot.
 * @param {*} map An object with keys and redirects.
 * @param {IOptions} [options=defaultOptions] The options.
 */
export function alias(robot: Robot, map: any): void {
  _alias(robot, map)
}
