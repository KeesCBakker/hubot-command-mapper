import { ICommand } from "./ICommand";
import { ITool } from "../ITool";

const path = require("path");

/**
 * Creates the reload command.
 *
 * @export
 * @param {NodeModule} caller The original caller. This is the script that called the mapper to register the tool.
 * @param {NodeModule} mapperModule The module of the mapper. This prevents reloading of the command mapper.
 * @param {boolean} [verbose=true] Indicates to add verbose logging.
 * @returns {ICommand} The command.
 */
export default function createReloadCommand(
  caller: NodeModule, mapperModule: NodeModule, verbose = true, reloadNodeModules = false): ICommand {
  return {
    name: "reload",
    invoke: (tool: ITool, robot: Hubot.Robot, res: Hubot.Response, match: RegExpMatchArray) => {

      //we cannot "unregister" the Hubot regex. Mute the tools from the same source,
      //so old versions of the are ignored when responding.
      robot.__tools
        .filter(t => t.__source == tool.__source)
        .forEach(t => t.mute = true);

      const toolFileName = caller.filename;

      //delete the caller from the require cache, it should
      //be reloaded from drive otherwise changes are not
      //picked up
      uncache(caller, verbose, mapperModule, reloadNodeModules);

      //use a timeout - otherwise you'll get an infinite number
      //of requests stating to reload the plugin. When this happens
      //the rate limitting of Slack comes in and will ban the bot
      //for a period of time.
      setTimeout(() => {
        if (verbose) {
          console.log("Reloading: " + toolFileName);
        }

        const p = path.dirname(toolFileName);
        const fn = path.basename(toolFileName);

        robot.loadFile(p, fn);

        res.reply(`Tool "${tool.name}" has been reloaded!`);
      }, 1000);
    }
  };
}

function uncache(
  m: NodeModule,
  verbose: boolean,
  mapperModule: NodeModule,
  reloadModules: boolean
) {
  let files = new Array<string>();
  fillModuleFiles(m, files, mapperModule);

  for (let file of files) {
    if (reloadModules || file.indexOf("node_modules") == -1) {
      if (verbose) {
        console.log("Uncaching: " + file);
      }

      delete require.cache[file];
    }
  }
}

function fillModuleFiles(
  m: NodeModule,
  files: Array<string>,
  mapperModule: NodeModule
) {
  if (m.filename == mapperModule.filename) {
    return;
  }

  if (files.indexOf(m.filename) != -1) {
    return;
  }

  files.push(m.filename);

  if (m.children) {
    for (let child of m.children) {
      fillModuleFiles(child, files, mapperModule);
    }
  }
}
