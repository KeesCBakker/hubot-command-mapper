import { IContext } from ".";

/**
 * Called when a command is excuted.
 * 
 * @export
 * @interface ICallback
 */
export interface ICallback {

  /**
   * The context contains all the information of
   * the command that was executed.
   */
  (context: IContext): void;
}
