import { ParameterBase } from "./Base";
import { escapeRegExp } from "./../regex";

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
    return `${this.values.map(v => escapeRegExp(v)).join("|")}`;
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
    super(name, defaultValue);
  }
}

/**
 * Matches a token. A token must be present.
 *
 * @export
 * @class TokenParameter
 * @extends {ChoiceParameter}
 */
export class TokenParameter extends ChoiceParameter {

  /**
   *Creates an instance of TokenParameter.
   * @param {string} name The name of the token. 
   * @memberof TokenParameter
   */
  constructor(token: string){

    super(token, [token], null);
  }
}

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
    var x = this.regexString;
    return `"${x}[^"]*"|'${x}[^']*'|${x}[^ ]*`;
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
    super(name, defaultValue);
  }
}

/**
 * Captures IP v4 addresses.
 *
 * @export
 * @class IPv4Parameter
 * @extends {ParameterBase}
 */
export class IPv4Parameter extends ParameterBase
{
  /**
   * 
   * @param name The name of the parameter.
   * @param defaultValue The default value of the parameter. When a default value is specified, the parameter becomes optional.
   * @param supportPrefix When a prefix is supported an ip address with the prefix (like /24) is also valid input.
   */
  constructor(name: string, defaultValue: string = null, public supportPrefix = true){
    super(name, defaultValue);
  }

  /**
   * The regular expression.
   *
   * @readonly
   * @memberof IPv4Parameter
   */
  public get regex(){
    
    const digit = `(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)`;

    let postFix = '';
    if(this.supportPrefix){
      postFix = `(\\/(3[0-2]|[1-2]\\d|[1-9]))?(?!\\/)(?!\\d+)`;
    }

    return `${digit}((\\.${digit}){3})({postfix})?${postFix}`;
  }
}
