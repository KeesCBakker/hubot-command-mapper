import { ICommand } from "."

/**
 * A tool is a collection of command that can be executed. Each command
 * is mapped in the following way: [tool-name] [command-name].
 *
 * @interface ITool
 */
export interface ITool {
  /**
   * Name of the tool. A required property.
   *
   * @type {string}
   * @memberof ITool
   */
  name: string

  /**
   * The command that are supported by the tool.
   * Only tools with at least 1 command can be mapped.
   *
   * @type {ICommand[]}
   * @memberof ITool
   */
  commands?: ICommand[]

  /**
   * Used for user-name based authorization. Only the specificed
   * users may access the tool.
   *
   * @type {string[]}
   * @memberof ITool
   */
  auth?: string[]

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
