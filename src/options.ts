import { isUndefined, isBoolean } from "util";

export interface IOptions
{
    addDebugCommand: boolean;
    addHelpCommand: boolean;
    addReloadCommand: boolean;
    verbose: boolean;
    showInvalidSyntax: boolean,
    showHelpOnInvalidSyntax: boolean,
    invalidSyntaxMessage: string,
    invalidSystaxHelpPrefix: string,
    notAuthorizedMessage: string,
    reloadNodeModules: boolean
}

export class Options implements IOptions {
  public addDebugCommand = get("HCM_ADD_DEBUG_COMMAND", true);
  public addHelpCommand = get("HCM_ADD_HELP_COMMAND", true);
  public addReloadCommand = get("HCM_ADD_RELOAD_COMAND", true);
  public showInvalidSyntax = get("HCM_SHOW_INVALID_SYNTAX", true);
  public showHelpOnInvalidSyntax = get("HCM_SHOW_HELP_ON_INVALID_SYNTAX", true);
  public invalidSyntaxMessage = get("HCM_INVALID_SYNTAX_MESSAGE", "invalid syntax.");
  public invalidSystaxHelpPrefix = get("HCM_INVALID_SYNTAX_HELP_PREFIX", "sorry, I don't understand. Maybe you could try:\n- ");
  public notAuthorizedMessage = get("HCM_NOT_AUTHORIZED_MESSAGE", "sorry, you are not authorized to use this command.");
  public verbose = get("HCM_VERBOSE", true);
  public reloadNodeModules = get("HCM_RELOAD_NODE_MODULES", false);

  constructor() {}
}

function get<T>(name: string, defaultValue: T):T{

  let value = <T><any>process.env[name];
 
  if (isUndefined(value)) {
    value = defaultValue;
  }

  if (isBoolean(defaultValue)){
    value = <T><any>Boolean(value);
  }

  return value;
}

const defaultOptions = new Options();
Object.freeze(defaultOptions);

export { defaultOptions };
