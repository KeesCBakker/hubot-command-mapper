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
export interface IParameter {

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
