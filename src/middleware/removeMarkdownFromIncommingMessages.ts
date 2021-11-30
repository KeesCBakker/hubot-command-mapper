import removeMarkDown from "remove-markdown"

export function removeMarkdownFromIncommingMessages(robot: Hubot.Robot) {
  if (!robot) throw "Argument 'robot' is empty."

  robot.receiveMiddleware((context, next, done) => {
    const text = context.response.message.text
    if (text) {
      let newText = removeMarkDown(text)
      if (text != newText) {
        context.response.message.text = newText
      }
    }

    next(done)
  })
}
