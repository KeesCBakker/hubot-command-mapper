import { ITool } from "./types"

/**
 * Indicates the object can handle messages.
 *
 * @export
 * @interface IMessageHandler
 */
type IMessageHandler = {
  /**
   * Indicates the handler can or cannot handle the given message.
   *
   * @param {string} msg The message.
   * @returns {Boolean} True if the handler can handle this message.
   *
   * @memberOf IMessageHandler
   */
  canHandle(msg: string): Boolean
}

type InternalRobot = Hubot.Robot & {
  __tools?: IMessageHandler[]
  __switches?: string[]
}

type InternalTool = ITool & {
  /**
   * A place where the debug registrations are kept. These registration
   * are used by the debug command.
   *
   * @type {{commandName: string, messageRegex: string}[]}
   * @memberof ITool
   */
  __registrations?: { commandName: string; messageRegex: string }[]

  /**
   * The regex that is used by the robot to match this tool.
   */
  __robotRegex?: RegExp
}