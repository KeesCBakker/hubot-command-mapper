import { IParameter } from "..";
import { IParameterValueCollection } from "../parameters/Base";
import { ITool } from "../tool";

/**
 * Models a command that can be invoked by the Hubot.
 * @interface ICommand
 */
export interface ICommand {
  
  /** The name of the command. Required property. */
  name: string;

  /** A list of usernames that will be used to authorize access to the command.
   * This is optional. */
  auth?: string[];
  
  /** A list of aliases of the command. Can be used to support multiple names to
   * trigger the command like: ["del", "rm"]. An empty alias is also possible to
   * add default commands to tools. The alias is optional.
   */
  alias?: string[];
  
  /** A regex that can be used to match values behind a command.*/
  capture?: string;

  /**
   * Specifies the parameters the command uses. Parameters will be used
   * to map values from the string to parameter values.
   * 
   * @type {IParameter[]}
   * @memberof ICommand
   */
  parameters?: IParameter[];

  /**
   * Called when the command is invoked. The parameters show the 
   * scope in which the command was called. The match contains 
   * captured information.
   * 
   * @param {ITool} [tool] The tool that owns the command.
   * @param {Hubot.Robot} [robot] The hubot.
   * @param {Hubot.Response} [res] The response. Can be used for interaction.
   * @param {RegExpMatchArray} [match] The regular expression match. Contains all the information about the mapped values of the command.
   * @param {IParameterValueCollection} [values] Provides easy access to the values of parameters.
   * @memberof ICommand
   */
  invoke(tool?: ITool, robot?: Hubot.Robot, res?: Hubot.Response, match?: RegExpMatchArray, values?: IParameterValueCollection): void;

  /**
   * The regular expression that is used to validate if a certain
   * typed command string can execute against this command. Needed
   * to prevent unwated execution of commands.
   * 
   * @type {RegExp}
   * @memberof ICommand
   */
  validationRegex?: RegExp;
}

export class Command implements ICommand{
    constructor(
        public name: string,
        public parameters: IParameter[] = null,
        public invoke: (
            tool?: ITool, 
            robot?: Hubot.Robot, 
            res?: Hubot.Response, 
            match?: RegExpMatchArray, 
            values?: IParameterValueCollection
        )=>void,
        public auth: string[] = null
    ){
    }
  }