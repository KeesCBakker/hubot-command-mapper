import { hasSwitch, setSwitch } from "../utils/switches"
import { convertBotNameIntoRegexString } from "../utils/regex"

const SWITCH = "rtbwcfim"

export function removeTrailingBotWhitespaceCharactersFromIncomingMessages(robot: Hubot.Robot) {
  if (!robot) throw "Argument 'robot' is empty."

  if (hasSwitch(robot, SWITCH)) {
    if (robot.logger) {
      robot.logger.info("The fix trailing spaces after bot middleware has already been registered.")
    }

    return
  }

  setSwitch(robot, SWITCH)

  const robotNameRegexString = convertBotNameIntoRegexString(robot.name, robot.alias)
  robot.receiveMiddleware(async context => {
    const text = context.response.message.text
    if (text) {
      const newText = text.replace(new RegExp(`(${robotNameRegexString})\\s+`, "si"), "$1 ")
      if (text != newText) {
        context.response.message.text = newText
      }
    }

    return true
  })
}
