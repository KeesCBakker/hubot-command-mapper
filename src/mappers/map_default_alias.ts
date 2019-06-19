import { IOptions, ITool, defaultOptions } from "..";
import { escapeRegExp } from "../utils/regex";

/**
 * If no tool is mapped to the text, this default alias
 * will be used to handle the text.
 * 
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {string} destination The destination alias of the command the text should be aliased to.
 * @param {IOptions} options The options.
 */
export function map_default_alias(
  robot: Hubot.Robot,
  destination: string,
  options: IOptions = defaultOptions
) {

  if (!robot) throw "Argument 'robot' is empty.";
  if (!destination) throw "Argument 'destination' is empty.";

  if (options.verbose) {
    console.log(`Aliasing default to '${destination}'.`);
  }

  let splitter = createBotCommandExtractor(robot.name, robot.alias);

  robot.receiveMiddleware((context, next, done) => {

    let text = context.response.message.text;
    if (isUnhandledMessage(robot, text)) {

      let data = splitter.exec(text);
      let robotName = data[1];
      let command = data[3].trim();
      let newText = robotName + ' ' + destination + ' ' + command;

      if (text != newText) {
        context.response.message.text = newText;
        if (options.verbose) {
          console.log(`Routing '${text}' to '${newText}'.`);
        }
      }
    }

    next(done);
  });
}

/**
 * Determines if the message is not handled by any tools.
 * 
 * @param {Hubot.Robot} robot The robot.
 * @param {string} msg The message.
 * @returns true when unhandled.
 */
function isUnhandledMessage(robot: Hubot.Robot, msg: string) {
  for (let tool of robot.__tools) {
    if (!tool.__mute) {
      let t = tool as ITool;
      if (t) {
        if (t.__robotRegex) {
          if (t.__robotRegex.test(msg)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

/**
 * Creates a regular expression that can extract the bot name and the
 * rest of the command.
 * 
 * @export
 * @param {string} name The name of the bot.
 * @param {string} alias The alias of the bot.
 * @returns {RegExp} The regular expression.
 */
function createBotCommandExtractor(name: string, alias: string): RegExp {
  return new RegExp(`^(@?(${escapeRegExp(name)}|${escapeRegExp(alias)}))(.*)$`, "i");
}