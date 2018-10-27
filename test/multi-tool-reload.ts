import { Options, mapper } from "../src";

export default robot =>{

    var options = new Options();
    options.verbose = false;
    options.addReloadCommand = true;

    mapper(robot, {
        name: "ci",
        invoke: (tool, robot, res): void => {
            res.reply("ci");
        }
    }, options);

    mapper(robot, {
        name: "cd",
        invoke: (tool, robot, res): void => {
            res.reply("cd");
        }
    }, options);

    mapper(robot, {
        name: "cicd",
        invoke: (tool, robot, res): void => {
            res.reply("cicd");
        }
    }, options);
}