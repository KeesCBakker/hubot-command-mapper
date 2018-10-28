export interface IMutable {

    /**
     * Used by the system to detect tools that have been
     * defined in the same node module. This is needed
     * for tools that are reloaded.
     *
     * @type {NodeModule}
     * @memberof ITool
     */    
    __source?: NodeModule;

    /**
     * Indicates the tool has been muted. It will no longer
     * respond. Needed for reloading tools.
     *
     * @type {boolean}
     * @memberof ITool
     */
    __mute?: boolean;

}