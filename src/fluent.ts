import { ITool, ICommand, StringParameter, NumberParameter, NumberStyle, mapper, RestParameter, Command } from "..";
import { IParameterValueCollection, IParameter } from "./parameters/Base";

"strict"

/**
 * Enables a fluent approach to the creation of a tool with commands.
 * 
 * @export
 * @interface IFluentTool
 */
export interface IFluentTool {
    /**
     * Only users that match the name are authenticated.
     * 
     * @param {string} name The name of the user.
     * @returns {IFluentTool} The tool.
     * @memberof IFluentTool
     */
    auth(name: string): IFluentTool;

    /**
     * Adds a command to the tool.
     * 
     * @param {string} name The name of the tool.
     * @returns {IFluentCommand} The comamnd.
     * @memberof IFluentTool
     */
    command(name: string): IFluentCommand;

    /**
     * Adds the command to the tool.
     * 
     * @param {ICommand} command The command.
     * @returns {IFluentFinalCommand} The tool.
     * @memberof IFluentTool
     */
    add(command: ICommand): IFluentFinalTool;
}

/**
 * Enables a fluent approach to the create of a command with parameters.
 * 
 * @export
 * @interface IFluentCommand
 * @extends {IFluentParameter}
 */
export interface IFluentCommand extends IFluentParameter {

    /**
     * Only users that match the name are authenticated.
     * 
     * @param {string} name The name of the command.
     * @returns {IFluentCommand} The command.
     * @memberof IFluentCommand
     */
    auth(name: string): IFluentCommand;

    /**
     * Adds an alias for the command. The command will be invocable
     * from the alias as well.
     * 
     * @param {string} name The name of the alias.
     * @returns {IFluentCommand} The command.
     * @memberof IFluentCommand
     */
    alias(name: string): IFluentCommand;
}

export interface IFluentParameter extends IInvocableCommand {

    /**
     * Adds a parameter.
     * 
     * @param {IParameter} parameter The parameter.
     * @returns {IFluentParameter} The command.
     * @memberof IFluentParameter
     */
    parameter(parameter: IParameter): IFluentParameter;

    /**
     * Adds a string parameter.
     * 
     * @param {string} name The name.
     * @param {string} [defaultValue] When a default value is specified, the parameter becomes optional. 
     * @returns {IFluentParameter} The command.
     * @memberof IFluentParameter
     */
    parameterOfString(name: string, defaultValue?: string): IFluentParameter;

    /**
     * Adds a number parameter.
     * 
     * @param {string} name The name.
     * @param {number} [defaultValue] When a default value is specified, the parameter becomes optional. 
     * @returns {IFluentParameter} The command.
     * @memberof IFluentParameter
     */
    parameterOfNumber(name: string, defaultValue?: number): IFluentParameter;

    /**
     * Adds a rest parameter. This parameter should only be added as the last parameter.
     * It captures all as a string.
     * 
     * @param {string} name The name.
     * @param {string} [defaultValue] When a default value is specified, the parameter becomes optional. 
     * @returns {IFluentFinalCommand} The command.
     * @memberof IFluentParameter
     */
    parameterForRest(name: string, defaultValue?: string): IFluentFinalTool
}

/**
 * An invocable command.
 * 
 * @export
 * @interface IInvocableCommand
 */
export interface IInvocableCommand {

    /**
     * Registers a callback for when the command is invoked.
     * 
     * @param {(
     *         tool: ITool,
     *         robot: Hubot.Robot,
     *         res: Hubot.Response,
     *         match: RegExpMatchArray,
     *         values: IParameterValueCollection) => void} callback
     * @returns {IFluentFinalCommand} The command.
     * @memberof IInvocableCommand
     */
    invoke(callback: (
        tool: ITool,
        robot: Hubot.Robot,
        res: Hubot.Response,
        match: RegExpMatchArray,
        values: IParameterValueCollection) => void): IFluentFinalTool;
}

/**
 * A final tools is a tool with at least one command
 * that can be mapped or another command can be chained.
 * 
 * @export
 * @interface IFluentFinalCommand
 */
export interface IFluentFinalTool {
    map(robot: Hubot.Robot): void;
    command(name: string): IFluentCommand;
    add(command: ICommand): IFluentFinalTool;
}

class FluentTool implements IFluentTool {

    private _tool: ITool;

    public constructor(name: string) {
        this._tool = {
            name: name,
            commands: [],
            auth: []
        };
    }

    getTool() {
        return this._tool;
    }

    auth(name: string): IFluentTool {
        this._tool.auth.push(name);
        return this;
    }

    command(name: string): IFluentCommand {
        return new FluentCommand(name, this);
    }

    add(command: ICommand): IFluentFinalTool {
        this._tool.commands.push(command);
        return new FluentFinalTool(this);
    }
}

class FluentCommand implements IFluentCommand {

    private _fluentTool: FluentTool;
    private _command: ICommand;

    constructor(name: string, fluentTool: FluentTool) {
        this._fluentTool = fluentTool;
        this._command = {
            name: name,
            alias: [],
            auth: [],
            parameters: [],
            invoke: null
        };
        this._fluentTool.getTool().commands.push(this._command);
    }

    auth(name: string): IFluentCommand {
        this._command.auth.push(name);
        return this;
    }
    alias(name: string): IFluentCommand {
        this._command.alias.push(name);
        return this;
    }
    parameter(parameter: IParameter): IFluentParameter {
        this._command.parameters.push(parameter);
        return this;
    }
    parameterOfString(name: string, defaultValue?: string): IFluentParameter {
        var p = new StringParameter(name, defaultValue);
        return this.parameter(p);
    }
    parameterOfNumber(name: string, defaultValue: Number = null, numberStyle: NumberStyle = NumberStyle.Both): IFluentParameter {
        var p = new NumberParameter(name, defaultValue, numberStyle)
        return this.parameter(p);
    }
    parameterForRest(name: string, defaultValue?: string): IFluentFinalTool {
        var p = new RestParameter(name, defaultValue);
        this.parameter(p);
        return new FluentFinalTool(this._fluentTool);
    }
    invoke(callback: (tool: ITool, robot: Hubot.Robot, res: Hubot.Response, match: RegExpMatchArray, values: IParameterValueCollection) => void): IFluentFinalTool {
        this._command.invoke = callback;
        return new FluentFinalTool(this._fluentTool);
    }
}

class FluentFinalTool implements IFluentFinalTool {

    private _fluentTool: FluentTool;

    constructor(fluentTool: FluentTool) {
        this._fluentTool = fluentTool;
    }

    map(robot: Hubot.Robot): void {
        let tool = this._fluentTool.getTool();
        mapper(robot, tool);
    }

    command(name: string): IFluentCommand {
        return this._fluentTool.command(name);
    }

    add(command: ICommand): IFluentFinalTool {
        return this._fluentTool.add(command);
    }
}

/**
 * Creates a fluent tool mapper.
 * 
 * @export
 * @param {string} name The name of the tool.
 * @returns {IFluentTool} The tool.
 */
export function tool(name: string): IFluentTool {
    return new FluentTool(name);
}