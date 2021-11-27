import { ParameterBase } from "./ParameterBase"
import { NumberStyle } from "./NumberStyle"

/**
 * This parameter will capture natural numbers.
 *
 * @export
 * @class NumberParameter
 * @extends {ParameterBase}
 * @implements {IOptionalParameter}
 */
export class NumberParameter extends ParameterBase {
  /**
   * Captures the optional minus sign, as well
   * as the whole number.
   *
   * @readonly
   * @memberof NumberParameter
   */
  public get regex() {
    var r = "\\d+"
    if (this.numberStyle == NumberStyle.Negative) {
      r = "-" + r
    } else if (this.numberStyle == NumberStyle.Both) {
      r = "-?" + r
    }
    return r
  }

  /**
   * Creates an instance of NumberParameter.
   * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof NumberParameter
   */
  constructor(
    name: string,
    defaultValue: Number = null,
    public numberStyle: NumberStyle = NumberStyle.Both
  ) {
    super(name, defaultValue)
  }
}
