import { ITool, ICommand, IParameterValueCollection } from ".";

export interface IHelpCommand extends ICommand {

     /**
     * Called when the command is invoked. The parameters show the
     * scope in which the command was called. The match contains
     * captured information.
     *
     * @param {ITool} [tool] The tool that owns the command.
     * @param {Hubot.Robot} [robot] The hubot.
     * @param {Hubot.Response} [res] The response. Can be used for interaction.
     * @param {RegExpMatchArray} [match] The regular expression match. Contains all the information about the mapped values of the command.
     * @param {IParameterValueCollection} [values] Provides easy access to the values of parameters.
     * @param {string} [helpMsgPrefix] The prefix that should be shown before printing the help.
     * @param {string} [noHelpMsg] The message that is shown when no help is available.
     * @memberof ICommand
     */
    invoke(
        tool: ITool, 
        robot: Hubot.Robot, 
        res: Hubot.Response, 
        match: RegExpMatchArray, 
        values: IParameterValueCollection, 
        helpMsgPrefix?: string, 
        noHelpMsg?: string): void;
}
