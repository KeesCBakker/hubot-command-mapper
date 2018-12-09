import { Options, map_command, IContext } from "../../src";

export default (robot: Hubot.Robot) => {

    var options = new Options();
    options.verbose = false;
    options.addReloadCommand = true;

    map_command(robot, "ci", (context) => context.res.reply("ci"), options);
    map_command(robot, "cd", (context) => context.res.reply("cd"), options);
    map_command(robot, "cicd", (context) => context.res.reply("cicd"), options);
}