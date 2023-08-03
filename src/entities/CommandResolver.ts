import { ITool } from ".."
import {
  ICommand,
  IParameterValueCollection,
  ICommandResolverResultDebugInfo,
} from "../definitions"
import { getValues } from "./parameters/ValueExtractor"
import { Logger } from "pino"

export class CommandResolver {
  constructor(private robot: Hubot.Robot) {}

  public resolve(res: Hubot.Response): CommandResolverResult | null {
    let tool: ITool = null

    if (this.robot.__tools) {
      tool = this.robot.__tools
        .map(t => (<any>t) as ITool)
        .find(
          t =>
            t != null &&
            t.__robotRegex != null &&
            t.__robotRegex.test(res.message.text)
        )
    }

    return this.resolveFromTool(tool, res)
  }

  public resolveFromTool(
    tool: ITool,
    res: Hubot.Response
  ): CommandResolverResult {
    if (!res.message.text) return null

    const result = new CommandResolverResult()
    result.user = res.message.user
    result.text = res.message.text

    if (tool == null) {
      return result
    }

    result.tool = tool

    const matchingCommands = result.tool.commands.filter(cmd =>
      cmd.validationRegex.test(res.message.text)
    )

    if (matchingCommands.length == 0) {
      return result
    }

    result.command = matchingCommands[0]
    result.authorized =
      (!result.tool.auth ||
        result.tool.auth.length === 0 ||
        result.tool.auth.indexOf(res.message.user.name) > -1) &&
      (!result.command.auth ||
        result.command.auth.length === 0 ||
        result.command.auth.indexOf(res.message.user.name) > -1)

    result.match = result.command.validationRegex.exec(res.message.text)
    result.values = getValues(
      this.robot.name,
      this.robot.alias,
      result.tool,
      result.command,
      res.message.text
    )

    return result
  }
}

export class CommandResolverResult {
  public tool: ITool
  public command: ICommand
  public authorized: Boolean
  public match: RegExpExecArray
  public values: IParameterValueCollection

  public text: string
  public user: Hubot.User

  public log(logger: Logger): void {
    if (logger) {
      const debug = this.getDebugInfo()
      logger.info(debug)
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
      values: this.values,
    }
  }
}
