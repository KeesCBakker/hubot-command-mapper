interface ITool
{
    /** Name of the tool. A required property. */
    name: string;

    /** The command that are supported by the tool.
     *  Only tools with at least 1 command can be mapped. */
    commands: Array<ICommand>;
    
    /** Used for user-name based authorization. Only the specificed 
     * users may access the tool. */
    auth?: Array<string>;

    mute?: boolean;
    registrations?: Array<{commandName: string, messageRegex: string}>;
}