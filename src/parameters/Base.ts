/**
 * Indicates the object implements a parameter. 
 * Parameters are added to Hubot commands. They are
 * used to generate a regular expression that
 * will extract values from the command the 
 * user has typed.
 * 
 * @export
 * @interface IParameter
 */
export interface IParameter
{
    /**
     * The name of the parameter should uniquely
     * identify the parameter. It can be used
     * to retrieve its value.
     * 
     * @type {string}
     * @memberof IParameter
     */
    readonly name: string;

    /**
     * The regular expression that will be used
     * to retrieve the value from the command
     * that the user has typed.
     * 
     * @type {string}
     * @memberof IParameter
     */
    readonly regex: string;

    /**
     * Indicates if this parameter is optional.
     * A user does not have to provide a value
     * in order for the command to be valid.
     * The default value will be used as value.
     * 
     * @type {boolean}
     * @memberof IOptionalParameter
     */
    readonly optional: boolean;

    /**
     * When the parameter is optional and no value
     * has been retrieved from the command the
     * user has typed, this value will be
     * given to the invocation of the command.
     * 
     * @type {*}
     * @memberof IParameter
     */
    readonly defaultValue: any;
}

/**
 * Map with parameter values. Values can be accessed
 * by the indexer.
 * 
 * @export
 * @interface IParameterValueCollection
 */
export interface IParameterValueCollection{

    readonly [name: string]: any;
}

/**
 * Base class for a parameter.
 * 
 * @export
 * @abstract
 * @class ParameterBase
 * @implements {IParameter}
 */
export abstract class ParameterBase implements IParameter
{
    /**
     * Gets the string version of the regular expression
     * that will be used to map the parameter value.
     * 
     * @readonly
     * @abstract
     * @type {string}
     * @memberof ParameterBase
     */
    public abstract get regex() : string;

    /**
     * Indicates that this parameter is optional.
     * A user does not have to provide a value
     * in order for this command to be valid.
     * 
     * @readonly
     * @memberof ParameterBase
     */
    public get optional() {
        return this.defaultValue != null;
    }

    /**
     * Creates an instance of ParameterBase.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional. 
     * @memberof ParameterBase
     */
    constructor(public name: string, public defaultValue = null){
    }
}