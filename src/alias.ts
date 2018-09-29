import { defaultOptions, IOptions } from ".";
import { escapeRegExp } from "./regex";

export function alias(
  robot: Hubot.Robot,
  map: any,
  options: IOptions = defaultOptions
) {

  if (!robot) throw "Argument 'robot' is empty.";
  if (!map) throw "Argument 'map' is empty.";

  if (options.verbose) {
    Object.keys(map).forEach(key =>
      console.log(`Aliasing '${key}' to '${map[key]}'.`)
    );
  }

  const splitter = new RegExp(
    `^(@?(${escapeRegExp(robot.name)}|${escapeRegExp(robot.alias || robot.name)}) )(.*)$`,
    "i"
  );

  const matchers = convertMapIntoRegularExpression(map);

  robot.receiveMiddleware((context, next, done) => {
    const text = context.response.message.text;
    const data = splitter.exec(text);
    if (data) {
      const command = data[3];
      const alias = matchers.find(m => m.matcher.test(command));
      if (alias) {
        const bot = data[1];
        const newText = bot + alias.value;
        context.response.message.text = newText;
        if (options.verbose) {
          console.log(`Routing '${text}' to '${newText}'.`)
        }
      }
    }
    next(done);
  });
}

function convertMapIntoRegularExpression(map) {
  return Object.keys(map).map(key => ({
    matcher: new RegExp(`^${escapeRegExp(key)}$`, "i"),
    value: map[key]
  }));
}