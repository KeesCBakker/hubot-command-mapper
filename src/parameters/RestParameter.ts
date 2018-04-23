import { ParameterBase } from "./Base"

/**
 * The "rest" parameter captures everything until
 * the end of the string. It can only be used as
 * the last parameter.
 * 
 * @class RestParameter
 * @extends {ParameterBase}
 */
export class RestParameter extends ParameterBase
{
    /**
     * Captures everything until the end of the string.
     * 
     * @readonly
     * @memberof RestParameter
     */
    public get regex() {
        return `.+$`;
    }
    
    /**
     * Creates an instance of RestParameter.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional. 
     * @memberof RestParameter
     */
    constructor(name: string, defaultValue: string = null){
        super(name, defaultValue);
    }
}