import { NumberStyle } from "./NumberStyle";
import { NumberParameter } from "./NumberParameter";
import { FractionStyle } from "./FractionStyle";

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

    /**
     *Creates an instance of FractionParameter.
     * @param {string} name The name of the parameter.
     * @param {any} [defaultValue=null] When a value is given, the parameter becomes optional.
     * @param {NumberStyle} [numberStyle=NumberStyle.Both] The style of the number (positive, negative, both).
     * @param {FractionStyle} [style=FractionStyle.Both] The style of the fraction (dot, comma or both).
     * @memberof FractionParameter
     */
    constructor(name: string, defaultValue: any = null, numberStyle: NumberStyle = NumberStyle.Both, public style: FractionStyle = FractionStyle.Both) {
        super(name, defaultValue, numberStyle);
    }

}