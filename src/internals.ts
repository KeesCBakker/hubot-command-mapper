import { Robot } from "hubot"
import { ITool } from "./types.js"

/**
 * Indicates the object can handle messages.
 *
 * @export
 * @interface IMessageHandler
 */
export type IMessageHandler = {
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

export type InternalRobot = Robot & {
  __tools?: IMessageHandler[]
  __switches?: string[]
}

export type InternalTool = ITool & {
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
