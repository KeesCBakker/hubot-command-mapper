import { IParameter } from "../../types.mjs"

/**
 * Base class for a parameter.
 *
 * @export
 * @abstract
 * @class ParameterBase
 * @implements {IParameter}
 */
export abstract class ParameterBase implements IParameter {
  /**
   * Gets the string version of the regular expression
   * that will be used to map the parameter value.
   *
   * @readonly
   * @abstract
   * @type {string}
   * @memberof ParameterBase
   */
  public abstract get regex(): string

  /**
   * Indicates that this parameter is optional.
   * A user does not have to provide a value
   * in order for this command to be valid.
   *
   * @readonly
   * @memberof ParameterBase
   */
  public get optional() {
    return this.defaultValue != null
  }

  /**
   * Creates an instance of ParameterBase.
   * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
   * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
   * @memberof ParameterBase
   */
  constructor(
    public name: string,
    public defaultValue: any = null
  ) {}
}
