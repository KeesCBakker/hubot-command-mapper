# hubot-command-mapper
_Helps with the mapping of tools and commands for your Hubot_

A _tool_ is a collection of _commands_ that can be invoked. A convention is used to map the command into the Hubot. The direct question `@hubot clear screen` will launch the `screen` command of the `clear` tool.

_Why?_ Writing regular expressions for commands is hard. You have to spend some time to prevent some expressions from colliding with others. Now the mapper takes care of that problem.

## Installation
Install the command mapper like this: `npm install hubot-command-mapper -save`

## A simple example
Let's define the _clear screen_ command by replying with 48 space-lines:
```
const mapper = require("hubot-command-mapper");

module.exports = robot => {
  const tool = {
    name: "clear",
    commands: [{
        name: "screen",
        invoke: (tool, robot, res)=>{
            for(let i = 0 ; i < 48; i++){
                res.emote(' ');
            }
        }
    }]
  };

  mapper(robot, tool);
};
```
The mapper will map the tool into the robot using the `respond` method. The `hear` method is currently not supported.

## Extra options
Each tool has a view extra options that will be added by the mapper:
- `@hubot tool-name debug`: will show which regular expressions are mapped
- `@hubot tool-name help`: will show the help of the tool, read from the original script file. It uses the help feature of Hubot.
- `@hubot tool-name reload`: will reload the script without having to restart the Hubot. This makes development easier.

## Full specification
A **tool** has the following specification:
```
interface ITool
{
    /** Name of the tool. A required property. */
    name: string;

    /** The command that are supported by the tool.
     *  Only tools with at least 1 command can be mapped. */
    commands: Array<ICommand>;
    
    /** Used for user-name based authorization. Only the specificed 
     * users may access the tool. */
    auth?: Array<string>;
}
```

A **command** has the following specification:
```
interface ICommand {
  
  /** The name of the command. Required property. */
  name: string;

  /** A list of usernames that will be used to authorize access to the command.
   * This is optional. */
  auth?: Array<string>;
  
  /** A list of aliases of the command. Can be used to support multiple names to
   * trigger the command like: ["del", "rm"]. An empty alias is also possible to
   * add default commands to tools. The alias is optional.
   */
  alias?: Array<string>;

  /** A regex that can be used to match values behind a command.*/
  capture?: string;
  
  /** Called when the command is invoked. The parameters show the scope in which
   * the command was called. The match contains captured information. */
  invoke(tool?: ITool, robot?: any, res?: any, match?: RegExpMatchArray): void;
}
```