import { InternalTool } from "../../internals.js"
import { ICommand, IContext } from "../../types.js"

export default function createDebugCommand(): ICommand {
  return {
    name: "debug",
    execute: (context: IContext): void => {
      let msg = `The tool "${context.tool.name}" uses the following commands:`

      const internalTool = context.tool as InternalTool
      const registrations = internalTool?.__registrations || []

      registrations.forEach(r => (msg += `\n- ${r.commandName}: ${r.messageRegex}`))

      context.res.reply(msg)
    }
  }
}
