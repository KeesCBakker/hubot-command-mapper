import { map_command as _map_command } from "./mappers/map_command";
import { map_tool } from "./mappers/map_tool";
import { alias as _alias } from "./mappers/alias";
import { defaultOptions, Options, IOptions } from "./entities/options";
import { NumberParameter } from "./entities/parameters/NumberParameter";
import { NumberStyle } from "./entities/parameters/NumberStyle";
import { FractionParameter } from "./entities/parameters/FractionParameter";
import { FractionStyle } from "./entities/parameters/FractionStyle";
import { IParameter, ITool, ICommand, ICallback } from "./definitions";
import { RestParameter } from "./entities/parameters/RestParameter";
import { AnyParameter } from "./entities/parameters/AnyParameter";
import { StringParameter } from "./entities/parameters/StringParameter";
import { ChoiceParameter } from "./entities/parameters/ChoiceParameter";
import { RegExStringParameter } from "./entities/parameters/RegExStringParameter";
import { TokenParameter } from "./entities/parameters/TokenParameter";
import { IPv4Parameter } from "./entities/parameters/IPv4Parameter";
import { IContext } from "mocha";

export {
  NumberParameter,
  NumberStyle,
  FractionParameter,
  FractionStyle,
  IParameter,
  RestParameter, 
  AnyParameter ,
  StringParameter,
  ChoiceParameter,
  RegExStringParameter,
  TokenParameter,
  IPv4Parameter,
  IOptions,
  defaultOptions, 
  Options, 
  ITool, 
  ICommand,
  ICallback,
  IContext
}

//needed for reload - otherwise the caller value will be cached
const caller = module.parent;
delete require.cache[__filename];

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
export function mapper(
  robot: Hubot.Robot,
  tool: ITool,
  options: IOptions = defaultOptions
)
{
  map_tool(caller, module, robot, tool, options);
}

/**
 * Creates a mapping for a single command.
 * 
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {string} command The command.
 * @param {(...(IParameter | ICallback | IOptions)[])} args You can specify parameters, the callback and options here.
 */
export function map_command(
  robot: Hubot.Robot,
  command: string,
  ...args: (IParameter | ICallback | IOptions)[]
): void {
  _map_command(caller, module, robot, command, args);
}

/**
 * Maps a list of alias commands.
 * 
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {*} map An object with keys and redirects.
 * @param {IOptions} [options=defaultOptions] The options.
 */
export function alias(
  robot: Hubot.Robot,
  map: any,
  options: IOptions = defaultOptions
) : void {
  _alias(caller, robot, map, options)  
}