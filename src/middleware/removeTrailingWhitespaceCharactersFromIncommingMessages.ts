import { IOptions, defaultOptions } from "..";
import { hasSwitch, setSwitch } from "../utils/switches";

const FIX_TRAILING_SPACES_SWITCH = 'ftss';

export function removeTrailingWhitespaceCharactersFromIncommingMessages(
    robot: Hubot.Robot,
    options: IOptions = defaultOptions
  ) {
  
    if (!robot) throw "Argument 'robot' is empty.";

    if(hasSwitch(robot, FIX_TRAILING_SPACES_SWITCH)){
      if(options.verbose)
        console.log("The fix trailing spaces middleware has already been registered.");

        return;
    }

    setSwitch(robot, FIX_TRAILING_SPACES_SWITCH);

    robot.receiveMiddleware((context, next, done) => {
  
      var text = context.response.message.text;
      var newText = text.replace(/\s+$/, '');
  
      if (text != newText) {
        context.response.message.text = newText;
      }
  
      next(done);
    });
  }
  