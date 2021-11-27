import { ParameterBase } from "./ParameterBase"

/**
 * Uses a regular expression to capture the value.
 *
 * @export
 * @class RegExStringParameter
 * @extends {ParameterBase}
 */
export class RegExStringParameter extends ParameterBase {
  /**
   * Uses the regexStrig to capture the value. Values can also be written
   * between quotes.
   *
   * @readonly
   * @memberof RegExStringParameter
   */
  public get regex() {
    var x = this.regexString
    return `"${x}[^"]*"|'${x}[^']*'|${x}[^ ]*`
  }
  /**
   * Creates an instance of RegExStringParameter.
   * @param {string} name The name of the parameter.
   * @param {string} regexString This regex string will be added to the regex that captures the value.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof RegExStringParameter
   */
  constructor(
    name: string,
    public regexString: string,
    public defaultValue: string = null
  ) {
    super(name, defaultValue)
  }
}

export class RegExParameter extends ParameterBase {
  /**
   * Uses the regexStrig to capture the value. Values can also be written
   * between quotes.
   *
   * @readonly
   * @memberof RegExStringParameter
   */
  public get regex() {
    return this.regexString
  }
  /**
   * Creates an instance of RegExStringParameter.
   * @param {string} name The name of the parameter.
   * @param {string} regexString This regex string will be added to the regex that captures the value.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof RegExStringParameter
   */
  constructor(
    name: string,
    public regexString: string,
    public defaultValue: string = null
  ) {
    super(name, defaultValue)
  }
}
