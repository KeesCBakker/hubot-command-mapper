git # hubot-command-mapper
_Helps with the mapping of tools and commands for your Hubot_

[![Build Status](https://travis-ci.org/KeesCBakker/hubot-command-mapper.svg?branch=master)](https://travis-ci.org/KeesCBakker/hubot-command-mapper) [![npm version](https://badge.fury.io/js/hubot-command-mapper.svg)](https://badge.fury.io/js/hubot-command-mapper) [![forever](https://david-dm.org/KeesCBakker/hubot-command-mapper.svg)](https://david-dm.org/KeesCBakker/hubot-command-mapper) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A _tool_ is a collection of _commands_ that can be invoked. A convention is used to map the command into the Hubot. The direct question `@hubot clear screen` will launch the `screen` command of the `clear` tool.

_Why?_ Writing regular expressions for commands is hard. You have to spend some time to prevent some expressions from colliding with others. Now the mapper takes care of that problem.

## Installation
Install the command mapper like this: `npm install hubot-command-mapper --save`

## A simple example
Let's define the _clear screen_ command by replying with 48 space-lines:
```
const { mapper } = require("hubot-command-mapper");

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

## Capturing with named parameters
A capture can be done in two ways. The first way is providing a regular expression-string as the `capture`. The values can be accesed through the `match` object in the invoke:

```
const { mapper } = require("hubot-command-mapper");

module.exports = robot => {
  const tool = {
    name: "count",
    commands: [{
        name: "from",
        capture: "(\\d+) to (\\d+)",
        invoke: (tool, robot, res, match)=>{
          const a = Number(match[3])
          const b = Number(match[4])

          for (let i = a; i < b + 1; i++) {
            res.reply(`${i}!`)
          }
        }
    }]
  };

  mapper(robot, tool);
};
```

Another way is using named parameters. The values can be accessed by the `values` object. Each value is added as a named property.

```
const { mapper, StringParameter } = require("hubot-command-mapper");

module.exports = robot => {
  const tool = {
    name: "norris",
    commands: [{
        name: 'impersonate',
        parameters: [new StringParameter('firstName'), new StringParameter('lastName')],
        invoke: (tool, robot, res, match, values) => {
          const firstName = encodeURIComponent(values.firstName)
          const lastName = encodeURIComponent(values.lastName)

          res.reply(`${firstName} ${lastName} has counted to infinity. Twice!`)
        }     
    }]
  };

  mapper(robot, tool);
};
```

The following parameters are available:
|Parameter type|Example|Purpose|
|--------------|-------|-------|
|`StringParameter`|`new StringParameter("name")`|Adds a string parameter|
|`StringParameter`|`new StringParameter("name", "Chuck Norris")`|Adds an optional string parameter that default to "Chuck Norris"|
|`StringParameter`|`new StringParameter("name")`|Adds a string parameter|
|`ChoiceParameter`|`new ChoiceParameter(["a", "b", "c"])`|Adds a choice parameter that matches "a", "b" or "c"|
|`RestParameter`|`new RestParameter("rest)`|Captures the rest of the tool. Used to capture anything else until the end.|

## Extra commands
Each tool has a view extra commands that will be added by the mapper:
- `@hubot tool-name debug`: will show which regular expressions are mapped
- `@hubot tool-name help`: will show the help of the tool, read from the original script file. It uses the help feature of Hubot.
- `@hubot tool-name reload`: will reload the script without having to restart the Hubot. This makes development easier.

## Full specification
A **tool** is an object with the following:
- `name:string`: the name of the tool. Required.
- `commands:Array<Command>`: The commands that are supported by the tool. Only tools with at least 1 command can be mapped. Required.
- `auth:Array<string>`: Used for user-name based authorization. Only the specificed users may access the tool. Optional.

A **command** has the following specification:
- `name:string`: the name of the command. Required.
- `invoke(tool?: ITool, robot?: any, res?: any, match?: RegExpMatchArray, values): void`: Called when the command is invoked. The parameters show the scope in which the command was called. The match contains captured information. Required.
- `alias:Array<string>`: A list of aliases of the command. Can be used to support multiple names to trigger the command like: `["del", "rm"]`. An empty alias is also possible to add default commands to tools. Optional.
- `auth:Array<string>`: A list of usernames that will be used to authorize access to the command. Optional.
- `capture:string`: A regex that can be used to match values behind a command. Optional.
- `parameters:[IParameter]`: a list of named parameters. The value of each parameter is added to the `values` object of the invoke callback. Possible values: `StringParameter`, `NumberParameter`, `FractionParameter`, `RegExParameter` and `RestParameter`.

## Notes
The tool also supports the reload of tools that have commands in different files like this:
```
const { mapper } = require("hubot-command-mapper"),
  connector = require("./norris/connector.js"),
  cmdImpersonate = require("./norris/impersonate.js"),
  cmdNr = require("./norris/nr.js"),
  cmdRandom = require("./norris/random.js");

module.exports = robot => {
  mapper(robot, {
    name: "norris",
    connector: connector,
    commands: [cmdRandom, cmdNr, cmdImpersonate]
  });
};
```

## Want to contribute?
Cool! We're using the following setup:
- Visual Studio Code
- TypeScript: compiles to `./dist`
- Mocha and Chai for testing: `npm test`
- Update dependencies: `npm run update-packages`

Contributions:
1. Create a branch
2. Create unit test(s) for the change(s)
3. Submit a pull request
4. Contact me <a href="https://twitter.com/KeesTalksTech">@KeesTalksTech</a> if I don't respond in time.

_Happy coding!_
