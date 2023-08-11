import { getValues } from "./parameters/ValueExtractor"
import { ICommand, ICommandResolverResultDebugInfo, ITool } from "../types"
import { InternalCommand, InternalRobot, InternalTool } from "../internals"
import { Log } from "hubot"

export class CommandResolver {
  constructor(private robot: InternalRobot) {}

  public resolve(res: Hubot.Response): CommandResolverResult | null {
    let tool: InternalTool = null

    if (this.robot.__tools) {
      tool = this.robot.__tools.find(t => t != null && t.canHandle(res.message.text)) as any as InternalTool
    }

    return this.resolveFromTool(tool, res)
  }

  public resolveFromTool(tool: ITool, res: Hubot.Response): CommandResolverResult | null {
    if (!res.message.text) return null

    const result = new CommandResolverResult()
    result.user = res.message.user
    result.text = res.message.text

    if (tool == null) {
      return result
    }

    result.tool = tool

    const matchingCommands = result.tool.commands.filter(
      (cmd: InternalCommand) => cmd.__validationRegex && cmd.__validationRegex.test(res.message.text)
    ) as InternalCommand[]

    if (matchingCommands.length == 0) {
      return result
    }

    const command = matchingCommands[0]

    result.command = command
    result.authorized =
      (!result.tool.auth || result.tool.auth.length === 0 || result.tool.auth.indexOf(res.message.user.name) > -1) &&
      (!result.command.auth ||
        result.command.auth.length === 0 ||
        result.command.auth.indexOf(res.message.user.name) > -1)

    result.match = command.__validationRegex.exec(res.message.text)
    result.values = getValues(this.robot.name, this.robot.alias, result.tool, result.command, res.message.text)

    return result
  }
}

export class CommandResolverResult {
  public tool: ITool
  public command: ICommand
  public authorized: Boolean
  public match: RegExpExecArray
  public values: Record<string, any>

  public text: string
  public user: Hubot.User

  public log(logger: Log): void {
    if (logger) {
      const debug = this.getDebugInfo()
      logger.info("Command", debug)
    }
  }

  public getDebugInfo(): ICommandResolverResultDebugInfo {
    return {
      user: this.user?.name,
      userId: this.user?.id,
      authorized: this.authorized,
      text: this.text,
      tool: this.tool?.name,
      command: this.command?.name,
      match: this.match,
      values: this.values
    }
  }
}
