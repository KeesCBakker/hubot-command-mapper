import { ICommand } from "./commands/commmand";

/**
 * A tool is a collection of command that can be executed. Each command
 * is mapped in the following way: [tool-name] [command-name].
 * 
 * @interface ITool
 * @template A The hubot adapter.
 */
export interface ITool<A>
{
    /**
     * Name of the tool. A required property.
     * 
     * @type {string}
     * @memberof ITool
     */
    name: string;

    /**
     * The command that are supported by the tool.
     * Only tools with at least 1 command can be mapped.
     * 
     * @type {ICommand<A>[]}
     * @memberof ITool
     */
    commands: ICommand<A>[];

    /**
     * Used for user-name based authorization. Only the specificed 
     * users may access the tool.
     * 
     * @type {string[]}
     * @memberof ITool
     */
    auth?: string[];

    /**
     * Indicates the tool has been muted. It will no longer
     * respond. Needed for reloading tools.
     * 
     * @type {boolean}
     * @memberof ITool
     */
    mute?: boolean;

    /**
     * A place where the debug registrations are kept. These registration
     * are used by the debug command.
     * 
     * @type {{commandName: string, messageRegex: string}[]}
     * @memberof ITool
     */
    registrations?: {commandName: string, messageRegex: string}[];
}