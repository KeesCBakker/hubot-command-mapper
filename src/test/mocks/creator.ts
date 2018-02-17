import mapper from "./../../mapper";
import MockedBot from "./mocked-bot";
import defaultOptions from "./../../defaultOptions";

export default function createNewRobotAndMapTool(name: string, tool: ITool) {
  const options = { ...defaultOptions };
  options.verbose = false;

  const robot = new MockedBot(name);
  mapper(robot, tool, options);
  return robot;
}
