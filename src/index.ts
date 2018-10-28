import { mapper as _mapper } from "./tool-mapper";
import { defaultOptions, Options, IOptions } from "./options";
import { ICommand } from "./commands/ICommand";
import { ITool } from "./ITool";
import { FluentTool, IFluentTool } from "./fluent";
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
import { alias } from "./alias";

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
  alias
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
 * Creates a fluent tool mapper.
 * 
 * @export
 * @param {string} name The name of the tool.
 * @returns {IFluentTool} The tool.
 */
export function tool(name: string): IFluentTool {
  return new FluentTool(name);
}
