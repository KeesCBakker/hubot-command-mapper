export { IParameter } from "./parameters/Base";

export {
  NumberParameter,
  NumberStyle,
  FractionParameter,
  FractionStyle
} from "./parameters/NumberParameters";

export { RestParameter } from "./parameters/RestParameter";

export {
  StringParameter,
  ChoiceParameter,
  RegExStringParameter
} from "./parameters/StringParameters";

import validateTool from "./validation";
import createDebugCommand from "./commands/debug";
import createReloadCommand from "./commands/reload";
import createHelpCommand from "./commands/help";
import {
  convertCommandIntoRegexString,
  convertToolIntoRegexString
} from "./regex";

import { defaultOptions, Options, IOptions } from "./options";
import { getValues } from "./parameters/ValueExtractor";
import { ICommand } from "./commands/commmand";
import { ITool } from "./tool";
export { defaultOptions, Options, ITool, ICommand };
export { tool } from "./fluent";

//needed for reload - otherwise the caller value will be cached
const caller = module.parent;
delete require.cache[__filename];

/**
 * Maps the specified tool to the Robot.
 *
 * @export
 * @param {IRobot} robot The robot.
 * @param {ITool} tool The tool that will be mapped.
 * @param {IOptions} [options] The options for this specific mapping.
 */
export function mapper(
  robot: Hubot.Robot,
  tool: ITool,
  options: IOptions = defaultOptions
) {
  if (!robot) throw "Argument 'robot' is empty.";
  if (!tool) throw "Argument 'tool' is empty.";

  validateTool(tool);

  //add a debug command
  tool.registrations = [];

  if (options.addDebugCommand) {
    tool.commands.push(createDebugCommand());
  }

  //add a reload command
  if (options.addReloadCommand) {
    tool.commands.push(
      createReloadCommand(
        caller,
        module,
        options.verbose,
        options.reloadNodeModules
      )
    );
  }

  //add help
  const helpCommand = createHelpCommand();
  if (options.addReloadCommand) {
    tool.commands.push(helpCommand);
  }

  //init every command
  tool.commands.forEach(cmd => {
    //use a second validation regex to confirm the message we
    //are responding to, is as we expected. This will prevent command
    //match edge cases in which certain phrases end with a command name
    const strValidationRegex = convertCommandIntoRegexString(
      robot.name,
      tool,
      cmd
    );

    cmd.validationRegex = new RegExp(strValidationRegex, "i");

    if (options.verbose) {
      console.log(
        `Mapping '${tool.name}.${cmd.name}' as '${strValidationRegex}'.`
      );
    }

    //needed for the debug command
    tool.registrations.push({
      commandName: cmd.name,
      messageRegex: strValidationRegex
    });
  });

  //listen for invocation of tool
  const toolRegexString = convertToolIntoRegexString(robot.name, tool);
  const toolRegex = new RegExp(toolRegexString, "i");

  robot.respond(toolRegex, res => {
    //don't do anything with muted tools. They are here as
    //part of a reload.
    if (tool.mute === true) {
      return;
    }

    const msg = res.message.text;

    const matchingCommands: ICommand[] = tool.commands.filter(cmd =>
      cmd.validationRegex.test(msg)
    );

    //if no commands matched, show help command
    if (matchingCommands.length == 0) {
      if (options.showHelpOnInvalidSyntax) {
        helpCommand.invoke(tool, robot, res, 
          null, null, 
          options.invalidSystaxHelpPrefix, options.invalidSyntaxMessage);
      } else if (options.showInvalidSyntax) {
        res.reply(options.invalidSyntaxMessage);
      }
      return;
    }

    const cmd = matchingCommands[0];

    let authorized =
      (!tool.auth || tool.auth.length === 0 || tool.auth.indexOf(res.message.user.name) > -1) &&
      (!cmd.auth || cmd.auth.length === 0 || cmd.auth.indexOf(res.message.user.name) > -1);

    var match = cmd.validationRegex.exec(msg);

    if (options.verbose) {
      var debug = {
        User: res.message.user.name,
        UserId: res.message.user.id,
        Authorized: authorized,
        Text: res.message.text,
        Tool: tool.name,
        Command: cmd.name,
        Match: match
      };
      console.log(debug);
    }

    if (!authorized) {
      res.reply(options.notAuthorizedMessage);
      return;
    }

    let values = getValues(robot.name || robot.alias, tool, cmd, res.message.text);
    cmd.invoke(tool, robot, res, match, values);
  });
}
