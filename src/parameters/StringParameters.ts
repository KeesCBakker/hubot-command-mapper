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
        return `"[^"]+"|'[^']+'|[^ ]+`;
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
        return `(${this.values.map(v => escapeRegExp(v)).join("|")})`;
    }

    /**
     * Creates an instance of ChoiceParameter.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {string[]} values The array of possible values.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional. 
     * @memberof ChoiceParameter
     */
    constructor(name: string, public values: string[], public defaultValue: string = null) {
        super(name, defaultValue);
    }
}

/**
 * Uses a regular expression to capture the value.
 * 
 * @export
 * @class RegexParameter
 * @extends {ParameterBase}
 */
export class RegExParameter extends ParameterBase
{
    /**
     * Creates an instance of ChoiceParameter.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {string[]} values The array of possible values.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional. 
     * @memberof ChoiceParameter
     */
    constructor(name: string, public regex: string, public defaultValue: string = null) {
        super(name, defaultValue);
    }
}