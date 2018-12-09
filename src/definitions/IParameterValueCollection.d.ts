/**
 * Map with parameter values. Values can be accessed
 * by the indexer.
 *
 * @export
 * @interface IParameterValueCollection
 */
export interface IParameterValueCollection {
    /** Name of the parameter. */
    [name: string]: any;
}
