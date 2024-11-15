import { Robot } from "hubot"
import removeMarkDown from "remove-markdown"

export function removeMarkdownFromIncomingMessages(robot: Robot) {
  if (!robot) throw "Argument 'robot' is empty."

  robot.receiveMiddleware(async context => {
    const text = context.response.message.text
    if (text) {
      let newText = removeMarkDown(text)
      if (text != newText) {
        context.response.message.text = newText
      }
    }

    return true
  })
}
