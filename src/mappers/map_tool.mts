import { Robot } from "hubot"
import { CommandResolver } from "../entities/CommandResolver.mjs"
import createDebugCommand from "../entities/commands/debug.mjs"
import createHelpCommand from "../entities/commands/help.mjs"
import { IOptions, defaultOptions } from "../index.mjs"
import { InternalTool, IMessageHandler, InternalRobot } from "../internals.mjs"
import {
  convertCommandIntoRegexString,
  convertToolIntoRegexString,
  convertBotNameIntoRegexString
} from "../utils/regex.mjs"
import validateToolAndThrowWhenInvalid from "./validation.mjs"

/**
 * Maps the specified tool to the Robot.
 *
 * @export
 * @param {IRobot} robot The robot.
 * @param {ITool} tool The tool that will be mapped.
 * @param {IOptions} [options] The options for this specific mapping.
 */
export function map_tool(robot: Robot, tool: InternalTool, options: IOptions = defaultOptions) {
  if (!robot) throw "Argument 'robot' is empty."
  if (!tool) throw "Argument 'tool' is empty."
  if (!tool.commands) tool.commands = []

  validateToolAndThrowWhenInvalid(tool)

  // add a debug command
  tool.__registrations = []

  if (options.addDebugCommand) {
    tool.commands.push(createDebugCommand())
  }

  //add help
  const helpCommand = createHelpCommand()
  if (options.addHelpCommand) {
    tool.commands.push(helpCommand)
  }

  //init every command
  tool.commands.forEach(cmd => {
    //use a second validation regex to confirm the message we
    //are responding to, is as we expected. This will prevent command
    //match edge cases in which certain phrases end with a command name
    const strValidationRegex = convertCommandIntoRegexString(robot.name, robot.alias, tool, cmd)

    cmd.validationRegex = new RegExp(strValidationRegex, "si")

    if (robot.logger) {
      robot.logger.info(`Mapping '${tool.name}.${cmd.name}' as '${strValidationRegex}'.`)
    }

    //needed for the debug command
    tool.__registrations.push({
      commandName: cmd.name,
      messageRegex: strValidationRegex
    })
  })

  //listen for invocation of tool
  const toolRegexString = convertToolIntoRegexString(robot.name, robot.alias, tool)
  const toolRegex = new RegExp(toolRegexString, "i")
  tool.__robotRegex = toolRegex

  const handler = tool as any as IMessageHandler
  handler.canHandle = (msg: string) => toolRegex.test(msg)

  // add tool to robot - helps with middleware
  const bot = robot as InternalRobot
  bot.__tools = bot.__tools || []
  bot.__tools.push(handler)

  const resolver = new CommandResolver(robot)

  robot.respond(toolRegex, async res => {
    var action = resolver.resolveFromTool(tool, res)
    if (!action || !action.tool) {
      return
    }

    //if no commands matched, show help command
    if (action.command == null) {
      if (options.showHelpOnInvalidSyntax) {
        helpCommand.execute(
          {
            robot,
            match: null,
            res,
            tool,
            values: {}
          },

          options.invalidSyntaxHelpPrefix,
          options.invalidSyntaxMessage
        )
      } else if (options.showInvalidSyntax) {
        res.reply(options.invalidSyntaxMessage)
      }
      return
    }

    action.log(bot.logger)

    if (!action.authorized) {
      res.reply(options.notAuthorizedMessage)
      return
    }

    if (options.replacedByBot) {
      const botRegexStr = convertBotNameIntoRegexString(robot.name, robot.alias)
      const botRegex = new RegExp(botRegexStr)
      const command = `@${options.replacedByBot} ` + action.text.replace(botRegex, "").trim()

      res.reply(
        `Sorry, this feature has been replaced by <@${options.replacedByBot}>. Please use:\n` +
          "```\n" +
          command +
          "\n```\n"
      )
    } else {
      action.command.execute({
        tool: tool,
        robot: robot,
        res: res,
        match: action.match,
        values: action.values
      })
    }
  })
}
