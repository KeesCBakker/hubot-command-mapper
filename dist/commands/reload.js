"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function createReloadCommand(caller, verbose = true) {
    return {
        name: "reload",
        invoke: (tool, robot, res) => {
            //we cannot "unregister" the Hubot regex. Mute the tool,
            //so old versions are ignored when responding.
            tool.mute = true;
            const toolFileName = caller.filename;
            //delete the caller from the require cache, it should
            //be reloaded from drive otherwise changes are not
            //picked up
            uncache(caller, verbose);
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
                res.reply(`Tool "${tool.name}" has been reloaded!`);
                robot.loadFile(p, fn);
            }, 1000);
        }
    };
}
exports.default = createReloadCommand;
function uncache(module, verbose) {
    let files = [];
    fillModuleFiles(module, files);
    for (let file of files) {
        if (verbose) {
            console.log("Uncaching: " + file);
        }
        delete require.cache[file];
    }
}
function fillModuleFiles(module, files) {
    if (files.indexOf(module.filename) != -1) {
        return;
    }
    files.push(module.filename);
    if (module.children) {
        for (let child of module.children) {
            fillModuleFiles(child, files);
        }
    }
}
