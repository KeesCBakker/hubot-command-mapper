import { ITool } from "./ITool";
import { IOptions, defaultOptions } from "./options";
import validateTool from "./validation";
import createDebugCommand from "./commands/debug";
import createReloadCommand from "./commands/reload";
import createHelpCommand from "./commands/help";
import { convertCommandIntoRegexString, convertToolIntoRegexString } from "./regex";
import { ICommand } from "./commands/ICommand";
import { getValues } from "./parameters/ValueExtractor";
import { IParameterValueCollection } from "./parameters/IParameterValueCollection";

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
    caller: NodeModule,
    packageModule: NodeModule,
    robot: Hubot.Robot,
    tool: ITool,
    options: IOptions = defaultOptions
  ) {
    if (!robot) throw "Argument 'robot' is empty.";
    if (!tool) throw "Argument 'tool' is empty.";
    if (!tool.commands) tool.commands = [];
  
    if(tool.invoke){
      tool.commands.push({
        name: 'default',
        alias: [''],
        invoke: (tool: ITool, robot: Hubot.Robot, res: Hubot.Response, match: RegExpMatchArray, values: IParameterValueCollection) => {
          tool.invoke(tool, robot, res, match, values);
        }
      });
    }
  
    validateTool(tool);
  
    // add a debug command
    tool.registrations = [];
  
    if (options.addDebugCommand) {
      tool.commands.push(createDebugCommand());
    }
  
    //add a reload command
    if (options.addReloadCommand) {
  
      // add caller
      tool.__source = caller;
  
      robot.__tools = robot.__tools || [];
      robot.__tools.push(tool);
  
      tool.commands.push(
        createReloadCommand(
          caller,
          packageModule,
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
  