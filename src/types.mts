import { Robot, Response } from "hubot"

/**
 * Called when a command is executed.
 *
 * @export
 * @interface ICallback
 */
export interface ICallback {
  /**
   * The context contains all the information of
   * the command that was executed.
   */
  (context: IContext): void
}

/**
 * Models a command that can be invoked by the Hubot.
 * @interface ICommand
 */
export interface ICommand {
  /** The name of the command. Required property. */
  name: string

  /** A list of usernames that will be used to authorize access to the command.
   * This is optional. */
  auth?: string[]

  /** A list of aliases of the command. Can be used to support multiple names to
   * trigger the command like: ["del", "rm"]. An empty alias is also possible to
   * add default commands to tools. The alias is optional.
   */
  alias?: string[]

  /** A regex that can be used to match values behind a command.*/
  capture?: string

  /**
   * Specifies the parameters the command uses. Parameters will be used
   * to map values from the string to parameter values.
   *
   * @type {IParameter[]}
   * @memberof ICommand
   */
  parameters?: IParameter[]

  /**
   * Called when the command is invoked.
   *
   * @param context Contextual data.
   */
  execute(context: IContext): void

  /**
   * The regular expression that is used to validate if a certain
   * typed command string can execute against this command. Needed
   * to prevent unwanted execution of commands.
   *
   * @type {RegExp}
   * @memberof ICommand
   */
  validationRegex?: RegExp
}

export interface IContext {
  tool: ITool
  robot: Robot
  res: Response
  match: RegExpMatchArray
  values: Record<string, any>
}

/**
 * Indicates the object implements a parameter.
 * Parameters are added to Hubot commands. They are
 * used to generate a regular expression that
 * will extract values from the command the
 * user has typed.
 *
 * @export
 * @interface IParameter
 */
export interface IParameter {
  /**
   * The name of the parameter should uniquely
   * identify the parameter. It can be used
   * to retrieve its value.
   *
   * @type {string}
   * @memberof IParameter
   */
  readonly name: string

  /**
   * The regular expression that will be used
   * to retrieve the value from the command
   * that the user has typed.
   *
   * @type {string}
   * @memberof IParameter
   */
  readonly regex: string

  /**
   * Indicates if this parameter is optional.
   * A user does not have to provide a value
   * in order for the command to be valid.
   * The default value will be used as value.
   *
   * @type {boolean}
   * @memberof IOptionalParameter
   */
  readonly optional: boolean

  /**
   * When the parameter is optional and no value
   * has been retrieved from the command the
   * user has typed, this value will be
   * given to the invocation of the command.
   *
   * @type {*}
   * @memberof IParameter
   */
  readonly defaultValue: any
}

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
   * Used for user-name based authorization. Only the specified
   * users may access the tool.
   *
   * @type {string[]}
   * @memberof ITool
   */
  auth?: string[]
}

export type ICommandResolverResultDebugInfo = {
  user: string
  userId: string
  authorized: Boolean
  text: string
  tool: string
  command: string
  match: RegExpExecArray
  values: Record<string, any>
}
