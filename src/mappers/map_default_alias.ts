import { InternalRobot } from "../internals"
import { escapeRegExp } from "../utils/regex"
import { hasSwitch, setSwitch } from "../utils/switches"

const SWITCH = "mda"

/**
 * If no tool is mapped to the text, this default alias
 * will be used to handle the text.
 *
 * @export
 * @param {Hubot.Robot} robot The robot.
 * @param {string} destination The destination alias of the command the text should be aliased to.
 * @param {IOptions} options The options.
 */
export function map_default_alias(robot: Hubot.Robot, destination: string, skipRegexes: RegExp[] = []) {
  if (!robot) throw "Argument 'robot' is empty."
  if (!destination) throw "Argument 'destination' is empty."

  if (hasSwitch(robot, SWITCH)) {
    throw "A default has already been mapped. Cannot map a 2nd default alias."
  }

  setSwitch(robot, SWITCH)

  if (robot.logger) {
    robot.logger.info(`Aliasing default to '${destination}'.`)
  }

  let splitter = createBotCommandExtractor(robot.name, robot.alias)

  robot.receiveMiddleware(async context => {
    let text = context.response.message.text

    if (isUnhandledMessage(robot, text)) {
      // should be skipped
      const shouldBeSkipped = skipRegexes.some(s => s.test(text))
      if (!shouldBeSkipped) {
        let data = splitter.exec(text)
        let robotName = data[1]
        let command = data[3].trim()
        let newText = robotName + " " + destination + " " + command

        if (text != newText) {
          context.response.message.text = newText
          if (robot.logger) {
            robot.logger.info(`Routing '${text}' to '${newText}'.`)
          }
        }
      }
    }

    return true
  })
}

/**
 * Determines if the message is not handled by any tools.
 *
 * @param {Hubot.Robot} robot The robot.
 * @param {string} msg The message.
 * @returns true when unhandled.
 */
function isUnhandledMessage(robot: InternalRobot, msg: string) {
  const tools = robot.__tools || []
  for (let tool of tools) {
    if (tool.canHandle(msg)) {
      return false
    }
  }

  return true
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
  return new RegExp(`^(@?(${escapeRegExp(name)}|${escapeRegExp(alias)}))(.*)$`, "i")
}
