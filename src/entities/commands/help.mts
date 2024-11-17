import { ICommand, IContext } from "../../types.mjs"

interface IHelpCommand extends ICommand {
  /**
   * Called when the command is invoked. The parameters show the
   * scope in which the command was called. The match contains
   * captured information.
   *
   * @param {IContext} [context] The context of the help tool that is created.
   * @param {string} [helpMsgPrefix] The prefix that should be shown before printing the help.
   * @param {string} [noHelpMsg] The message that is shown when no help is available.
   * @memberof ICommand
   */
  execute(context: IContext, helpMsgPrefix?: string, noHelpMsg?: string): void
}

export default function createHelpCommand(): IHelpCommand {
  return {
    name: "help",
    alias: ["?", "/?", "--help"],
    execute: (context: IContext, helpMsgPrefix?: string, noHelpMsg?: string): void => {
      const botName = "@" + (context.robot.alias || context.robot.name)

      let helpCommands = context.robot
        .helpCommands()
        .filter(cmd => cmd.startsWith("hubot " + context.tool.name))
        .map(cmd => cmd.replace(/hubot/g, botName))

      helpCommands.sort()

      if (helpCommands.length === 0) {
        if (noHelpMsg) {
          context.res.reply(noHelpMsg)
          return
        }

        context.res.reply(`the tool _${context.tool.name}_ has no help.`)
        return
      }

      if (!helpMsgPrefix) {
        helpMsgPrefix = `the tool _${context.tool.name}_ has the following commands:\n- `
      }

      let msg = helpMsgPrefix + helpCommands.join("\n- ")

      context.res.reply(msg)
    }
  }
}
