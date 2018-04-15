/**
 * A tool is a collection of command that can be executed. Each command
 * is mapped in the following way: [tool-name] [command-name].
 * 
 * @interface ITool
 * @template A The hubot adapter.
 */
interface ITool<A>
{
    /** Name of the tool. A required property. */
    name: string;

    /** The command that are supported by the tool.
     *  Only tools with at least 1 command can be mapped. */
    commands: Array<ICommand<A>>;
    
    /** Used for user-name based authorization. Only the specificed 
     * users may access the tool. */
    auth?: Array<string>;

    /** Indicates the tool has been muted. It will no longer
     * respond. Needed for reloading tools. */
    mute?: boolean;

    /** A place where the debug registrations are kept. */
    registrations?: Array<{commandName: string, messageRegex: string}>;
}
