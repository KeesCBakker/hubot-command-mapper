import { Options, map_command, IContext } from "../src";

export default robot =>{

    var options = new Options();
    options.verbose = false;
    options.addReloadCommand = true;

    map_command(robot, "ci", (context:IContext) => context.res.reply("ci"), options);
    map_command(robot, "cd", (context:IContext) => context.res.reply("cd"), options);
    map_command(robot, "cicd", (context:IContext) => context.res.reply("cicd"), options);
}