import { IOptions, defaultOptions } from "..";
import { hasSwitch, setSwitch } from "../utils/switches";
import { convertBotNameIntoRegexString } from "../utils/regex";

const SWITCH = 'rtbwcfim';

export function removeTrailingBotWhitespaceCharactersFromIncommingMessages(
  robot: Hubot.Robot,
  options: IOptions = defaultOptions
) {

  if (!robot) throw "Argument 'robot' is empty.";

  if (hasSwitch(robot, SWITCH)) {
    if (options.verbose)
      console.log("The fix trailing spaces after bot middleware has already been registered.");

    return;
  }

  setSwitch(robot, SWITCH);

  const robotNameRegexString = convertBotNameIntoRegexString(robot.name, robot.alias);
  robot.receiveMiddleware((context, next, done) => {
    const text = context.response.message.text;
    if (text) {
      const newText = text.replace(new RegExp(`(${robotNameRegexString})\\s+`, "i"), '$1 ');
      if (text != newText) {
        context.response.message.text = newText;
      }
    }

    next(done);
  });
}
