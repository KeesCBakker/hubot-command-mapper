import { ITool, ICommand } from "./../../definitions"

export default function createDebugCommand(): ICommand {
  return {
    name: "debug",
    invoke: (
      tool: ITool,
      robot: Hubot.Robot,
      res: Hubot.Response,
      match: RegExpMatchArray
    ): void => {
      let msg = `The tool "${tool.name}" uses the following commands:`

      tool.__registrations.forEach(
        r => (msg += `\n- ${r.commandName}: ${r.messageRegex}`)
      )

      res.reply(msg)
    },
  }
}
