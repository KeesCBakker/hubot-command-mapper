import { mapper, Options } from "./../../";
import MockedBot from "./mocked-bot";

export default function createNewRobotAndMapTool(name: string, tool: ITool) {
  const options = new Options();
  options.verbose = false;

  const robot = new MockedBot(name);
  mapper(robot, tool, options);
  return robot;
}
