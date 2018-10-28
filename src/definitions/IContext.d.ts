import { ITool } from "./ITool";
import { IParameterValueCollection } from "./IParameterValueCollection";

export interface IContext {
    tool: ITool;
    robot: Hubot.Robot;
    res: Hubot.Response;
    match: RegExpMatchArray;
    values: IParameterValueCollection;
  }