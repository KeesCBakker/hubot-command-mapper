export default function createDebugCommand(): ICommand {
  return {
    name: "debug",
    invoke: (tool, robot, res, match) => {
      let msg = `The tool "${tool.name}" uses the following commands:`;
      tool.registrations.forEach(
        r => (msg += `\n- ${r.commandName}: ${r.messageRegex}`)
      );
      res.reply(msg);
    }
  };
}
