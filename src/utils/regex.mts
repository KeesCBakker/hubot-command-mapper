"strict"

import { ITool, ICommand, IParameter } from "../index.mjs"


/**
 * Converts the specified tool into a regular expression
 * that can be used by the bot.
 */
export function convertToolIntoRegexString<A>(robotName: string, robotAlias: string, tool: ITool) {
  // add space or end to the tool matcher to prevent tools
  // that are names similar to match and show an invalid
  // syntax warning. Like: ci and cicd tools.
  let regexString = escapeRegExp(tool.name) + "($| )"
  return regexString
}

export function convertBotNameIntoRegexString(robotName: string, robotAlias: string) {
  let regexString = "^"

  if (robotName == robotAlias || !robotAlias) {
    regexString += "@?"
    regexString += robotName
  } else {
    regexString += "(@?"
    regexString += escapeRegExp(robotName)
    regexString += "|@?"
    regexString += escapeRegExp(robotAlias)
    regexString += ")"
  }

  return regexString
}

/**
 * Converts the specified command into a regular expression
 * that can be used by the bot.
 *
 * @param robotName The name of the robot.
 * @param tool The tool.
 * @param cmd The command.
 * @param {boolean} [useNaming=false] If the value is true, named groups will be used for each parameter.
 */
export function convertCommandIntoRegexString(
  robotName: string,
  robotAlias: string | null,
  tool: ITool,
  cmd: ICommand,
  useNaming = false
) {
  //the following regex is created:
  //^{botname} {tool-name} {command-name or alias list} {capture of the rest}$
  let regexString = convertBotNameIntoRegexString(robotName, robotAlias)

  regexString += " "

  regexString += escapeRegExp(tool.name)
  regexString += "( "
  regexString += escapeRegExp(cmd.name)

  let addOptionalCommand = false

  if (cmd.alias) {
    cmd.alias.forEach(a => {
      if (a == "") {
        addOptionalCommand = true
        return
      }

      regexString += "| "
      regexString += escapeRegExp(a)
    })
  }

  let extraSpace = true

  //convert parameters to capture
  if (cmd.parameters && cmd.parameters.length > 0) {
    extraSpace = false
    cmd.capture = convertParametersToRegex(cmd.parameters, useNaming)
  }

  if (cmd.capture) {
    if (addOptionalCommand) {
      regexString += "|"

      //make sure capture does not interfere with other commands
      //as they take precedence over a capture.
      const commands: string[] = []
      tool.commands.forEach(c => {
        //if a command does not use capture, add string terminator
        //this prevents non-capture commands from flowing into
        //a capture command.
        let postfix = "$"
        if (c.capture || (c.parameters != null && c.parameters.length > 0)) {
          postfix = "(?=( |$))"
        }

        commands.push(` ${escapeRegExp(c.name)}${postfix}`)

        if (c.alias) {
          c.alias
            .filter(c => c != "")
            .map(c => escapeRegExp(c))
            .map(c => " " + c + postfix)
            .forEach(c => commands.push(c))
        }
      })

      if (commands.length > 0) {
        regexString += "(?!("
        regexString += commands.join("|")
        regexString += "))"
      }
    }
  }

  regexString += ")"

  if (cmd.capture) {
    //command / tool separator!
    if (extraSpace) {
      regexString += " "
    }

    //capture the capture in a group so it will
    //be accessible through the matches
    regexString += "("
    regexString += cmd.capture
    regexString += ")"
  } else if (addOptionalCommand) {
    //when an optional command is added and there is
    //no capturing of data, we need to make the group
    //options. Because there is no capture, the negative
    //lookahead will not be rendered, so the group
    //needs to be optional.
    regexString += "?"
  }

  regexString += "$"

  return regexString
}

/**
 * Escapes the given string for usage in a regular expression.
 *
 * @export
 * @param {any} str The string.
 * @returns The escaped regular expression.
 */
export function escapeRegExp(str: string) {
  str = str || ""
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

/**
 * Converts the given parameters to a regular expression string.
 *
 * @export
 * @param {IParameter[]} parameters The parameters.
 * @param {boolean} [useNaming=false] If the value is true, named groups will be used for each parameter.
 * @returns
 */
export function convertParametersToRegex(parameters: IParameter[], useNaming = false) {
  let r = parameters
    .map(p => {
      //{SPACE}{GROUP COMMAND}{PARAMETER REGEX}{/GROUP COMMAND}
      let pr = "( (" //space needed to seperate commands
      if (useNaming) {
        let name = escapeRegExp(p.name)
        pr += `(?<${name}>`
      }
      pr += p.regex
      if (useNaming) {
        pr += ")"
      }
      pr += "))"
      if (p.optional) {
        pr += "?"
      }
      return pr
    })
    .join("")

  return r
}
