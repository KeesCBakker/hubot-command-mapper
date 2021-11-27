import { AnyParameter } from "./AnyParameter"

export class RestParameter extends AnyParameter {
  /**
   * Creates an instance of AnyParameter.
   * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof RestParameter
   */
  constructor(name: string, defaultValue: string = null) {
    super(name, defaultValue)
  }
}
