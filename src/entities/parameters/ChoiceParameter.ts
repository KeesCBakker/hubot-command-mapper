import { escapeRegExp } from "../../utils/regex.js"
import { ParameterBase } from "./ParameterBase.js"

/**
 * Parameter that has a fixed set of values. Remember all values
 * are not case sensitive.
 *
 * @export
 * @class ChoiceParameter
 * @extends {ParameterBase}
 */
export class ChoiceParameter extends ParameterBase {
  /**
   * Will only capture the choices.
   *
   * @readonly
   * @memberof ChoiceParameter
   */
  public get regex() {
    return `${this.values.map(v => escapeRegExp(v)).join("|")}`
  }

  /**
   * Creates an instance of ChoiceParameter.
   * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
   * @param {string[]} values The array of possible values.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof ChoiceParameter
   */
  constructor(
    name: string,
    public values: string[],
    public defaultValue: string = null
  ) {
    super(name, defaultValue)
  }
}
