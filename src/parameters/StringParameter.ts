import { ParameterBase } from "./ParameterBase";

/**
 * Parameter that will capture a string. This is an continued
 * string of letters without spaces or a string that is surrounded
 * by quotes.
 *
 * @export
 * @class StringParameter
 * @extends {ParameterBase}
 */
export class StringParameter extends ParameterBase {
  
  /**
   * Capture a quoted array or anything without spaces.
   *
   * @readonly
   * @memberof StringParameter
   */
  public get regex() {
    return `"[^"]*"|'[^']*'|[^ ]+`;
  }

  /**
   * Creates an instance of StringParameter.
   * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof StringParameter
   */
  constructor(name: string, public defaultValue: string = null) {
    super(name, defaultValue);
  }
}
