import { Robot, Response } from "../definitions/irobot";

export default function createHelpCommand<A>() {
  return {
    name: "help",
    alias: ["?", "/?", "--help"],
    invoke: (
      tool: ITool<A>,
      robot: Robot<A>,
      res: Response<A>,
      match: RegExpMatchArray,
      helpMsgPrefix?: string,
      noHelpMsg?: string
    ): void => {
      const botName = "@" + (robot.alias || robot.name);

      let helpCommands = robot
        .helpCommands()
        .filter(cmd => cmd.startsWith("hubot " + tool.name))
        .map(cmd => cmd.replace(/hubot/g, botName));

      helpCommands.sort();

      if (helpCommands.length === 0) {
        if (noHelpMsg) {
          res.reply(noHelpMsg);
          return;
        }

        res.reply(`the tool _${tool.name}_ has no help.`);
        return;
      }

      if (!helpMsgPrefix) {
        helpMsgPrefix = `the tool _${
          tool.name
        }_ has the following commands:\n- `;
      }

      let msg = helpMsgPrefix + helpCommands.join("\n- ");

      res.reply(msg);
    }
  };
}
