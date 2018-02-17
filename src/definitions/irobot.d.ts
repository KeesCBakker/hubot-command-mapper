interface IRobot {
  name: string;

  alias: string;

  helpCommands(): Array<string>;

  loadFile(directory: string, fileName: string);

  respond(regex: RegExp, onRespond: (res: IResponse) => void): void;
}
