interface ICommand {
  
  /** The name of the command. Required property. */
  name: string;

  /** A list of usernames that will be used to authorize access to the command.
   * This is optional. */
  auth?: Array<string>;
  
  /** A list of aliases of the command. Can be used to support multiple names to
   * trigger the command like: ["del", "rm"]. An empty alias is also possible to
   * add default commands to tools. The alias is optional.
   */
  alias?: Array<string>;

  /** A regex that can be used to match values behind a command.*/
  capture?: string;
  
  /** Called when the command is invoked. The parameters show the scope in which
   * the command was called. The match contains captured information. */
  invoke(tool?: ITool, robot?: IRobot, res?: IResponse, match?: RegExpMatchArray): void;

  validationRegex?: RegExp;
}
