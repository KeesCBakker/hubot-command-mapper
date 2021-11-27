import { IParameterValueCollection } from "."

export interface ICommandResolverResultDebugInfo {
  user: string
  userId: string
  authorized: Boolean
  text: string
  tool: string
  command: string
  match: RegExpExecArray
  values: IParameterValueCollection
}
