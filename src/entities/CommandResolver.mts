import { Log, Response, User } from "hubot"
import { InternalRobot, InternalTool } from "../internals.mjs"
import { ITool, ICommand, ICommandResolverResultDebugInfo } from "../types.mjs"
import { getValues } from "./parameters/ValueExtractor.mjs"

export class CommandResolver {
  constructor(private robot: InternalRobot) {}

  public resolve(res: Response): CommandResolverResult | null {
    let tool: InternalTool = null

    if (this.robot.__tools) {
      tool = this.robot.__tools.find(t => t != null && t.canHandle(res.message.text)) as any as InternalTool
    }

    return this.resolveFromTool(tool, res)
  }

  public resolveFromTool(tool: ITool, res: Response): CommandResolverResult {
    if (!res.message.text) return null

    const result = new CommandResolverResult()
    result.user = res.message.user
    result.text = res.message.text

    if (tool == null) {
      return result
    }

    result.tool = tool

    const matchingCommands = result.tool.commands.filter(cmd => cmd.validationRegex.test(res.message.text))

    if (matchingCommands.length == 0) {
      return result
    }

    result.command = matchingCommands[0]
    result.authorized =
      (!result.tool.auth || result.tool.auth.length === 0 || result.tool.auth.indexOf(res.message.user.name) > -1) &&
      (!result.command.auth ||
        result.command.auth.length === 0 ||
        result.command.auth.indexOf(res.message.user.name) > -1)

    result.match = result.command.validationRegex.exec(res.message.text)
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
  public user: User

  public log(logger: Log): void {
    if (logger) {
      const debug = this.getDebugInfo()
      logger.info("Command", debug)
    }
  }

  public getDebugInfo(): ICommandResolverResultDebugInfo {
    return {
      user: this.user ? this.user.name : null,
      userId: this.user ? this.user.id : null,
      authorized: this.authorized,
      text: this.text,
      tool: this.tool ? this.tool.name : null,
      command: this.command ? this.command.name : null,
      match: this.match,
      values: this.values
    }
  }
}
