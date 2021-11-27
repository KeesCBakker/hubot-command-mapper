import { ITool, IParameterValueCollection } from "."

export interface IContext {
  tool: ITool
  robot: Hubot.Robot
  res: Hubot.Response
  match: RegExpMatchArray
  values: IParameterValueCollection
}
