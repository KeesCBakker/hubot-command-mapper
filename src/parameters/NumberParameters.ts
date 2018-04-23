import { ParameterBase } from "./Base"

/**
 * Types of numbers that can be used.
 * 
 * @export
 * @enum {number}
 */
export enum NumberStyle {

    /**
     * Allow positive numbers.
     */
    Positive,
    /**
     * Allow negative numbers.
     */
    Negative,
    /**
     * Allow both numbers. 
     */
    Both
}

/**
 * This parameter will capture natural numbers.
 * 
 * @export
 * @class NumberParameter
 * @extends {ParameterBase}
 * @implements {IOptionalParameter}
 */
export class NumberParameter extends ParameterBase {

    /**
     * Captures the optional minus sign, as well
     * as the whole number.
     * 
     * @readonly
     * @memberof NumberParameter
     */
    public get regex() {
        var r = "\\d+";
        if (this.numberStyle == NumberStyle.Negative) {
            r = "-" + r;
        }
        else if (this.numberStyle == NumberStyle.Both) {
            r = "-?" + r;
        }
        return r;
    }

    /**
     * Creates an instance of NumberParameter.
     * @param {string} name The name of the parameter. Can be used to identify the parameter value as well.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional. 
     * @memberof NumberParameter
     */
    constructor(name: string, defaultValue: Number = null, public numberStyle: NumberStyle = NumberStyle.Both) {
        super(name, defaultValue);
    }
}

/**
 * Defines the fraction style.
 * 
 * @export
 * @enum {number}
 */
export enum FractionStyle {
    /**
     * Fractions are seperated by a '.'. 
     */
    Dot,
    /**
     * Fractions are seperated by a ','. 
     */
    Comma,
    /**
     * Fractions can be seperated by both a '.' and a ','. 
     */
    Both
}

export class FractionParameter extends NumberParameter {

    /**
     * Captures the sign (when specified), both numbers of the
     * fraction and the sperator.
     * 
     * @readonly
     * @memberof FractionParameter
     */
    public get regex() {
        var r = super.regex + "(";
        if (this.style == FractionStyle.Both) {
            r += "(\.|,)";
        }
        else if (this.style == FractionStyle.Comma) {
            r += ",";
        }
        else if (this.style == FractionStyle.Dot) {
            r += ".";
        }

        r += "\\d+)?";
        return r;
    }

    constructor(name: string, defaultValue: any = null, numberStyle: NumberStyle = NumberStyle.Both, public style: FractionStyle = FractionStyle.Both) {
        super(name, defaultValue, numberStyle);
    }
}