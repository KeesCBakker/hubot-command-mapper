import { defaultOptions, IOptions } from ".";

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
    `^(@?(${resc(robot.name)}|${resc(robot.alias)}) )(.*)$`,
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
    matcher: new RegExp(`^${resc(key)}$`, "i"),
    value: map[key]
  }));
}

function resc(str) {
  str = str || '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
