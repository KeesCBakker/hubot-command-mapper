/**
 * Converts the specified tool into a regular expression
 * that can be used by the bot.
 *
 * @export
 * @param {ITool} tool The tool.
 * @returns
 */
export function convertToolIntoRegexString(robotName: string, tool: ITool) {
  let regexString = "^@?";
  regexString += escapeRegExp(robotName);
  regexString += " ";
  regexString += escapeRegExp(tool.name);
  
  return regexString;
}

/**
 * Converts the specified command into a regular expression
 * that can be used by the bot.
 *
 * @param robotName The name of the robot.
 * @param tool The tool.
 * @param cmd The command.
 */
export function convertCommandIntoRegexString(
  robotName: string,
  tool: ITool,
  cmd: ICommand
) {
  //the following regex is created:
  //^{botname} {tool-name} {command-name or alias list} {capture of the rest}$
  let regexString = "";

  regexString += "^@?";
  regexString += escapeRegExp(robotName);
  regexString += " ";

  regexString += escapeRegExp(tool.name);
  regexString += "( ";
  regexString += escapeRegExp(cmd.name);

  let addOptionalCommand = false;

  if (cmd.alias) {
    cmd.alias.forEach(a => {
      if (a == "") {
        addOptionalCommand = true;
        return;
      }

      regexString += "| ";
      regexString += escapeRegExp(a);
    });
  }

  if (cmd.capture) {
    if (addOptionalCommand) {
      regexString += "|";

      //make sure capture does not interfere with other commands
      //as they take precedence over a capture.
      const commands = [];
      tool.commands.forEach(c => {
        //if a command does not use capture, add string terminator
        //this prevents non-capture commands from flowing into
        //a capture command.
        let postfix = c.capture ? "" : "$";

        commands.push(` ${escapeRegExp(c.name)}${postfix}`);

        if (c.alias) {
          c.alias
            .filter(c => c != "")
            .map(c => escapeRegExp(c))
            .map(c => " " + c + postfix)
            .forEach(c => commands.push(c));
        }
      });

      if (commands.length > 0) {
        regexString += "(?!(";
        regexString += commands.join("|");
        regexString += "))";
      }
    }
  }

  regexString += ")";

  if (cmd.capture) {
    //command / tool sperator!
    regexString += " ";

    //capture the capture in a group so it will
    //be accessable through the matches
    regexString += "(";
    regexString += cmd.capture;
    regexString += ")";
  } else if (addOptionalCommand) {
    //when an optional command is added and there is
    //no capturing of data, we need to make the group
    //options. Because there is no capture, the negative
    //lookahead will not be rendered, so the group
    //needs to be optional.
    regexString += "?";
  }

  regexString += "$";

  return regexString;
}

function escapeRegExp(str) {
  str = str || "";
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
