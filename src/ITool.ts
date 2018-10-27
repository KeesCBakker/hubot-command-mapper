import { ICommand } from "./commands/ICommand";
import { IParameterValueCollection } from "./parameters/IParameterValueCollection";
/**
 * A tool is a collection of command that can be executed. Each command
 * is mapped in the following way: [tool-name] [command-name].
 *
 * @interface ITool
 */
export interface ITool {

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
     * @type {ICommand[]}
     * @memberof ITool
     */
    commands?: ICommand[];
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
    registrations?: {
        commandName: string;
        messageRegex: string;
    }[];
    /**
     * Called when the default tool is invoked. This will generate a command
     * with an empty alias.
     *
     * @param {ITool} [tool] The tool that owns the command.
     * @param {Hubot.Robot} [robot] The hubot.
     * @param {Hubot.Response} [res] The response. Can be used for interaction.
     * @param {RegExpMatchArray} [match] The regular expression match. Contains all the information about the mapped values of the command.
     * @param {IParameterValueCollection} [values] Provides easy access to the values of parameters.
     * @memberof ICommand
     */
    invoke?(tool: ITool, robot: Hubot.Robot, res: Hubot.Response, match: RegExpMatchArray, values: IParameterValueCollection): void;
}