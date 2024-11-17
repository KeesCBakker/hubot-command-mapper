import { Robot } from "hubot"
import { CommandResolver } from "../entities/CommandResolver.mjs"
import { ICommandResolverResultDebugInfo } from "../index.mjs"

export function addDiagnosticsMiddleware(robot: Robot, callback: (debug: ICommandResolverResultDebugInfo) => void) {
  if (!robot) throw "Argument 'robot' is empty."
  if (!callback) throw "Argument 'callback' is empty."

  robot.receiveMiddleware(async context => {
    const resolver = new CommandResolver(robot)
    const action = resolver.resolve(context.response)

    if (action) {
      const debug = action.getDebugInfo()
      callback(debug)
    }

    return true
  })
}
