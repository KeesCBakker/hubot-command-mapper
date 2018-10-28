import { mapper as _mapper } from "./mappers/tool-mapper";
import { map_command as _map_command } from "./mappers/command-mapper";
import { defaultOptions, Options, IOptions } from "./options";
import { ICommand } from "./commands/ICommand";
import { ITool } from "./definitions/ITool";
import { NumberParameter } from "./parameters/NumberParameter";
import { NumberStyle } from "./parameters/NumberStyle";
import { FractionParameter } from "./parameters/FractionParameter";
import { FractionStyle } from "./parameters/FractionStyle";
import { RestParameter } from "./parameters/RestParameter";
import { AnyParameter } from "./parameters/AnyParameter";
import { StringParameter } from "./parameters/StringParameter";
import { ChoiceParameter } from "./parameters/ChoiceParameter";
import { RegExStringParameter } from "./parameters/RegExStringParameter";
import { TokenParameter } from "./parameters/TokenParameter";
import { IPv4Parameter } from "./parameters/IPv4Parameter";
import { IParameter } from "./parameters/IParameter";
import { alias as _alias } from "./mappers/alias";
import { ICallback, IContext } from "./single-command";

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
  _mapper(caller, module, robot, tool, options);
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