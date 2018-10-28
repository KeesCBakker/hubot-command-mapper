import { ParameterBase } from "./ParameterBase";
/**
 * Captures IP v4 addresses.
 *
 * @export
 * @class IPv4Parameter
 * @extends {ParameterBase}
 */
export class IPv4Parameter extends ParameterBase {

  /**
   *
   * @param name The name of the parameter.
   * @param defaultValue The default value of the parameter. When a default value is specified, the parameter becomes optional.
   * @param supportPrefix When a prefix is supported an ip address with the prefix (like /24) is also valid input.
   */
  constructor(name: string, defaultValue: string = null, public supportPrefix = true) {
    super(name, defaultValue);
  }

  /**
   * The regular expression.
   *
   * @readonly
   * @memberof IPv4Parameter
   */
  public get regex() {
    const digit = `(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)`;
    let postFix = '';
    if (this.supportPrefix) {
      postFix = `(\\/(3[0-2]|[1-2]\\d|[1-9]))?(?!\\/)(?!\\d+)`;
    }
    return `${digit}((\\.${digit}){3})({postfix})?${postFix}`;
  }
}
