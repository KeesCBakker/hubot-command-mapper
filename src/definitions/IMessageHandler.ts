
/**
 * Indicates the object can handle messages.
 * 
 * @export
 * @interface IMessageHandler
 */
export interface IMessageHandler {

    /**
     * Indicates the handler can or cannot handle the given message.
     * 
     * @param {string} msg The message.
     * @returns {Boolean} True if the handler can handle this message.
     * 
     * @memberOf IMessageHandler
     */
    canHandle(msg:string): Boolean;
}
