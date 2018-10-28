import { ParameterBase } from "./ParameterBase";

/**
* The "any" parameter captures anything until a new parameter is met.
* @class RestParameter
* @extends {ParameterBase}
*/
export class AnyParameter extends ParameterBase {
    /**
     * Captures everything until the end of the string.
     *
     * @readonly
     * @memberof RestParameter
     */
    public get regex() {
        return `.+`;
    }
    /**
     * Creates an instance of AnyParameter.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
     * @memberof AnyParameter
     */
    constructor(name: string, defaultValue: string = null) {
        super(name, defaultValue);
    }
}
