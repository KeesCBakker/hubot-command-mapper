import { escapeRegExp } from "../utils/regex"
import { IOptions } from "../entities/options"
import { IMap } from "../definitions"
import { IMessageHandler } from "../definitions/IMessageHandler"

class AliasMapping implements IMessageHandler {
  public matchers: RegularExpessionMap[]
  public splitter: RegExp

  constructor(map: IMap, robot: Hubot.Robot) {
    this.splitter = createBotCommandExtractor(
      robot.name,
      robot.alias || robot.name
    )
    this.matchers = convertMapIntoRegularExpression(map)
  }

  public process(text: string): string {
    const data = this.splitter.exec(text)
    if (!data) return text

    const command = data[3]
    const alias = this.matchers.find(m => m.matcher.test(command))
    if (!alias) return text

    const bot = data[1]
    let newText = bot + alias.value

    const match = alias.matcher.exec(command)
    if (match.length > 1) newText = newText + " " + match[1]

    return newText
  }

  public canHandle(msg: string): Boolean {
    const data = this.splitter.exec(msg)
    if (!data) return false

    const command = data[3]
    const alias = this.matchers.find(m => m.matcher.test(command))
    if (!alias) return false

    return true
  }
}

export function alias(robot: Hubot.Robot, map: any, options: IOptions) {
  if (!robot) throw "Argument 'robot' is empty."
  if (!map) throw "Argument 'map' is empty."

  if (options.verbose) {
    Object.keys(map).forEach(key =>
      console.log(`Aliasing '${key}' to '${map[key]}'.`)
    )
  }

  var mapping = new AliasMapping(map, robot)
  robot.__tools = robot.__tools || []
  robot.__tools.push(mapping)

  robot.receiveMiddleware((context, next, done) => {
    var text = context.response.message.text
    var newText = mapping.process(text)

    if (text != newText) {
      context.response.message.text = newText
      if (options.verbose) {
        console.log(`Routing '${text}' to '${newText}'.`)
      }
    }

    next(done)
  })
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
  return new RegExp(
    `^(@?(${escapeRegExp(name)}|${escapeRegExp(alias)}) )(.*)$`,
    "i"
  )
}

function convertMapIntoRegularExpression(map: IMap): RegularExpessionMap[] {
  return Object.keys(map).map(key => {
    let value = map[key]
    let regex = key.endsWith("*")
      ? new RegExp(`^${escapeRegExp(key.substr(0, key.length - 1))} (.+)$`, "i")
      : new RegExp(`^${escapeRegExp(key)}$`, "i")

    return new RegularExpessionMap(regex, value)
  })
}

class RegularExpessionMap {
  public matcher: RegExp
  public value: string

  constructor(matcher: RegExp, value: string) {
    this.matcher = matcher
    this.value = value
  }
}
