import { IOptions, defaultOptions } from "..";
import { hasSwitch, setSwitch } from "../utils/switches";

const SWITCH = 'rtwcfim';

export function removeTrailingWhitespaceCharactersFromIncommingMessages(
  robot: Hubot.Robot,
  options: IOptions = defaultOptions
) {

  if (!robot) throw "Argument 'robot' is empty.";

  if (hasSwitch(robot, SWITCH)) {
    if (options.verbose)
      console.log("The fix trailing spaces middleware has already been registered.");

    return;
  }

  setSwitch(robot, SWITCH);

  robot.receiveMiddleware((context, next, done) => {

    var text = context.response.message.text;
    if (text) {
      var newText = text.replace(/\s+$/, '');
      if (text != newText) {
        context.response.message.text = newText;
      }
    }

    next(done);
  });
}
