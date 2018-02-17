interface ICommand {
  name: string;
  auth?: Array<string>;
  alias?: Array<string>;
  capture?: string;
  validationRegex?: RegExp;
  invoke(
    tool?: ITool,
    robot?: IRobot,
    res?: IResponse,
    match?: RegExpMatchArray
  ): void;
}
