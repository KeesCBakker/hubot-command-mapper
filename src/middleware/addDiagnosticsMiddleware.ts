import { IOptions, defaultOptions, ICommandResolverResultDebugInfo } from "..";
import { hasSwitch, setSwitch } from "../utils/switches";
import { CommandResolver } from "../entities/CommandResolver";

export function addDiagnosticsMiddleware(
  robot: Hubot.Robot,
  callback: (debug: ICommandResolverResultDebugInfo) => void,
  options: IOptions = defaultOptions
) {

  if (!robot) throw "Argument 'robot' is empty.";
  if (!callback) throw "Argument 'callback' is empty.";

  robot.receiveMiddleware((context, next, done) => {

    const resolver = new CommandResolver(robot);
    const action = resolver.resolve(context.response);

    if (action) {
      const debug = action.getDebugInfo();
      callback(debug);
    }

    next(done);
  });
}
