export class Options implements IOptions {
  public addDebugCommand = true;
  public addHelpCommand = true;
  public addReloadCommand = true;
  public showInvalidSyntax = true;
  public showHelpOnInvalidSyntax = true;
  public invalidSyntaxMessage = "invalid syntax.";
  public invalidSystaxHelpPrefix = "sorry, I don't understand. Maybe you could try:\n- ";
  public notAuthorizedMessage = "sorry, you are not authorized to use this command.";
  public verbose = true;

  constructor() {}
}

const defaultOptions = new Options();
Object.freeze(defaultOptions);

export { defaultOptions };
