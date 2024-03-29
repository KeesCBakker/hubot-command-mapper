export type IOptions = {
  addDebugCommand?: boolean
  addHelpCommand?: boolean
  showInvalidSyntax?: boolean
  showHelpOnInvalidSyntax?: boolean
  invalidSyntaxMessage?: string
  invalidSyntaxHelpPrefix?: string
  notAuthorizedMessage?: string
  replacedByBot?: string
}

export class Options implements IOptions {
  public addDebugCommand: boolean
  public addHelpCommand: boolean
  public showInvalidSyntax: boolean
  public showHelpOnInvalidSyntax: boolean
  public invalidSyntaxMessage: string
  public invalidSyntaxHelpPrefix: string
  public notAuthorizedMessage: string
  public replacedByBot: string

  constructor() {
    this.addDebugCommand = getB("HCM_ADD_DEBUG_COMMAND", false)
    this.addHelpCommand = getB("HCM_ADD_HELP_COMMAND", true)
    this.showInvalidSyntax = getB("HCM_SHOW_INVALID_SYNTAX", true)
    this.showHelpOnInvalidSyntax = getB("HCM_SHOW_HELP_ON_INVALID_SYNTAX", true)
    this.invalidSyntaxMessage = getS("HCM_INVALID_SYNTAX_MESSAGE", "invalid syntax.")
    this.invalidSyntaxHelpPrefix = getS(
      "HCM_INVALID_SYNTAX_HELP_PREFIX",
      "sorry, I don't understand. Maybe you could try:\n- "
    )
    this.notAuthorizedMessage = getS("HCM_NOT_AUTHORIZED_MESSAGE", "sorry, you are not authorized to use this command.")
  }
}

function getS(name: string, defaultValue: string): string {
  let value = process.env[name]

  if (!value) {
    value = defaultValue
  }

  return value
}

function getB(name: string, defaultValue: boolean): boolean {
  let value = process.env[name]

  if (!value) {
    value = defaultValue.toString()
  }

  return value === "true"
}

const defaultOptions = new Options()
Object.freeze(defaultOptions)

export { defaultOptions }
