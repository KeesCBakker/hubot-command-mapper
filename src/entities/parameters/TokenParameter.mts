import { ChoiceParameter } from "./ChoiceParameter.mjs";

/**
 * Matches a token. A token must be present.
 *
 * @export
 * @class TokenParameter
 * @extends {ChoiceParameter}
 */
export class TokenParameter extends ChoiceParameter {
  /**
   *Creates an instance of TokenParameter.
   * @param {string} name The name of the token.
   * @memberof TokenParameter
   */
  constructor(token: string) {
    super(token, [token], null)
  }
}
