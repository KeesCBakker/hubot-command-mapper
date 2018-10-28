import { IParameterValueCollection } from "../parameters/IParameterValueCollection";
import { ITool } from "..";

export interface IContext {
  tool: ITool;
  robot: Hubot.Robot;
  res: Hubot.Response;
  match: RegExpMatchArray;
  values: IParameterValueCollection;
}

export interface ICallback {
  (context: IContext): void;
}
