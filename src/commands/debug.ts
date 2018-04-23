import { ITool } from "../tool";
import { ICommand } from "./commmand";

export default function createDebugCommand<A>(): ICommand<A> {
  return {
    name: "debug",
    invoke: (
      tool: ITool<A>,
      robot: Hubot.Robot<A>,
      res: Hubot.Response<A>,
      match: RegExpMatchArray
    ): void => {
      let msg = `The tool "${tool.name}" uses the following commands:`;
      tool.registrations.forEach(
        r => (msg += `\n- ${r.commandName}: ${r.messageRegex}`)
      );
      res.reply(msg);
    }
  };
}
