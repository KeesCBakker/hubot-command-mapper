import { mapper, Options } from "./../../";
import { MockedBot } from "./mocked-bot";

export function createNewRobotAndMapTool(name: string, tool: ITool, tool2?: ITool, tool3?: ITool) {
  const options = new Options();
  options.verbose = false;

  const robot = new MockedBot(name);
  mapper(robot, tool, options);

  if(tool2) mapper(robot, tool2, options);
  if(tool3) mapper(robot, tool3, options);

  return robot;
}
