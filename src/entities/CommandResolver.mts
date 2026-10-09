import { Log, Response, User } from "hubot"
import { InternalRobot } from "../internals.mjs"
import { ITool, ICommand, ICommandResolverResultDebugInfo } from "../types.mjs"
import { getValues } from "./parameters/ValueExtractor.mjs"

export class CommandResolver {
  constructor(private robot: InternalRobot) {}

  public resolve(res: Response): CommandResolverResult | null {
    const text = res.message.text
    if (!text) return null
    const handler = this.robot.__tools?.find(t => t.canHandle(text))
    const tool = handler && "name" in handler ? handler : null
    return this.resolveFromTool(tool, res)
  }

  public resolveFromTool(tool: ITool | null | undefined, res: Response): CommandResolverResult | null {
    const text = res.message.text
    if (!text) return null

    const result = new CommandResolverResult()
    result.user = res.message.user
    result.text = text

    if (tool == null) {
      return result
    }

    result.tool = tool

    const command = tool.commands?.find(cmd => cmd.validationRegex?.test(text))
    if (!command?.validationRegex) return result
    result.command = command
    result.authorized =
      (!result.tool.auth || result.tool.auth.length === 0 || result.tool.auth.indexOf(res.message.user.name) > -1) &&
      (!result.command.auth ||
        result.command.auth.length === 0 ||
        result.command.auth.indexOf(res.message.user.name) > -1)

    result.match = command.validationRegex.exec(text)
    result.values = getValues(this.robot.name, this.robot.alias, result.tool, result.command, text)

    return result
  }
}

export class CommandResolverResult {
  public tool: ITool | null = null
  public command: ICommand | null = null
  public authorized?: boolean
  public match: RegExpExecArray | null = null
  public values?: Record<string, any>

  public text: string = ""
  public user: User | null = null

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
