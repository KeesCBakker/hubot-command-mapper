# hubot-command-mapper

_Helps with the mapping of tools and commands for your Hubot. No more regex. No more tool restarts during development._

[![Build Status](https://travis-ci.org/KeesCBakker/hubot-command-mapper.svg?branch=master)](https://travis-ci.org/KeesCBakker/hubot-command-mapper) [![npm version](https://badge.fury.io/js/hubot-command-mapper.svg)](https://badge.fury.io/js/hubot-command-mapper) [![forever](https://david-dm.org/KeesCBakker/hubot-command-mapper.svg)](https://david-dm.org/KeesCBakker/hubot-command-mapper) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

_Why?_ Writing regular expressions for commands is hard. You have to spend some time to prevent expressions from colliding with others. Now the mapper takes care of that problem.

## Installation

Install the command mapper like this:

```sh
npm install hubot-command-mapper --save
```

## A simple example

Let's define the _clear screen_ command by replying with 48 space-lines:

```js
const { map_command } = require("hubot-command-mapper")

map_command(pretend.robot, "clear screen", options, context => {
  for (let i = 0; i < 48; i++) {
    context.res.emote(" ")
  }
})
```

The mapper will map the command into the robot using the `respond` method. The `hear` method is currently not supported.

## A complexer example

Let's group a few actions into a _tool_. A tool has a name and a collection of named commands. They are mapped in such a way that the actions will not collide. Here we've created a todo list with the `add`, `list` and `remove` actions:

```js
const { map_tool, RestParameter } = require("hubot-command-mapper")

module.exports = robot => {
  let todos = []

  map_tool(robot, {
    name: "todo",
    commands: [
      {
        name: "add",
        alias: [""],
        parameters: [new RestParameter("item")],
        execute: context => {
          todos.push(context.values.item)
          context.res.reply(`Added _${context.values.item}_ to the list.`)
        },
      },
      {
        name: "list",
        alias: [""],
        execute: context => {
          if (!todos.length) context.res.reply("The list is empty.")
          else {
            let txt = "The following item(s) are on the list:\n"
            txt += todos.map(t => "- " + t).join("\n")
            context.res.reply(txt)
          }
        },
      },
      {
        name: "remove",
        alias: ["del", "rm"],
        parameters: [new RestParameter("item")],
        execute: context => {
          const f = context.values.item.toLowerCase()
          const a = todos.filter(t => t.toLowerCase().indexOf(f) == -1)
          const x = todos.length - a.length
          todos = a
          context.res.reply(`Removed ${x} item(s) from the list.`)
        },
      },
    ],
  })
}
```

## Alias

Sometimes you want to have more control over the way commands and tools are
prented to user. The rigid control you need as a developer does not have to
end up in your tool. You can use the `alias` and `map_default_alias` to
route messages to your tools and commands.

Alias will take a map and route accordingly. Please use `*` to match more
than the alias itself.

```js
// imagine you have the following commands:
// @bot todo list: lists all the items on the todo list
// @bot todo add {item}: adds the item to the list

const { alias } = require("hubot-command-mapper")

module.exports = robot => {
  alias(robot, {
    list: "todo list",
    "todo*": "todo add",
  })
}
```

But what if you want to route all messages that are not handled by tools to a certain action? Use `map_default_alias`. You can provide regular expressions for messages that should be skipped.

```js
// imagine you have the following commands:
// @bot search `query`: searches the database

const { alias } = require("hubot-command-mapper")

module.exports = robot => {
  map_default_alias(robot, "search", /help/i)
}
```

## Capturing with named parameters

A capture can be done in two ways. The first way is providing a regular expression-string as the `capture`. The values can be accesed through the `match` object in the invoke:

```js
const { mapper } = require("hubot-command-mapper")

module.exports = robot => {
  const tool = {
    name: "count",
    commands: [
      {
        name: "from",
        capture: "(\\d+) to (\\d+)",
        execute: context => {
          // because an alias might be used, we need to select
          // from the end of the matches.
          const a = Number(context.match[context.match.length - 2])
          const b = Number(context.match[context.match.length - 1])

          for (let i = a; i < b + 1; i++) {
            context.res.reply(`${i}!`)
          }
        },
      },
    ],
  }

  mapper(robot, tool)
}
```

Another way is using named parameters. The values can be accessed by the `values` object. Each value is added as a named property.

```js
const { mapper, StringParameter } = require("hubot-command-mapper")

module.exports = robot => {
  const tool = {
    name: "norris",
    commands: [
      {
        name: "impersonate",
        parameters: [
          new StringParameter("firstName"),
          new StringParameter("lastName"),
        ],
        execute: context => {
          const firstName = context.values.firstName
          const lastName = context.values.lastName

          context.res.reply(
            `${firstName} ${lastName} has counted to infinity. Twice!`
          )
        },
      },
    ],
  }

  mapper(robot, tool)
}
```

The following parameters are available:

| Parameter type    | Example                                        | Purpose                                                                        |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `StringParameter` | `new StringParameter("name")`                  | Adds a string parameter                                                        |
| `StringParameter` | `new StringParameter("name", "Chuck Norris")`  | Adds an optional string parameter that default to "Chuck Norris"               |
| `StringParameter` | `new StringParameter("name")`                  | Adds a string parameter                                                        |
| `ChoiceParameter` | `new ChoiceParameter("name", ["a", "b", "c"])` | Adds a choice parameter that matches "a", "b" or "c"                           |
| `RestParameter`   | `new RestParameter("rest)`                     | Captures the rest of the message. Used to capture anything else until the end. |
| `TokenParameter`  | `new TokenParameter("source")`                 | Captures a token. A token must be present in the string.                       |
| `IPv4Parameter`   | `new IPv4Parameter("ip")`                      | Matches an IP version 4 address.                                               |

## Extra commands

Each tool has a view extra commands that will be added by the mapper:

- `@hubot tool-name debug`: will show which regular expressions are mapped
- `@hubot tool-name help`: will show the help of the tool, read from the original script file. It uses the help feature of Hubot.

## Full specification

A **tool** is an object with the following:

- `name:string`: the name of the tool. Required.
- `commands:Array<Command>`: The commands that are supported by the tool. Only tools with at least 1 command can be mapped. Required.
- `auth:Array<string>`: Used for user-name based authorization. Only the specificed users may access the tool. Optional.

A **command** has the following specification:

- `name:string`: the name of the command. Required.
- `execute(context): void` : Called when the command is invoked. The context has the scope in which the command was called. The match contains captured information. Required. <br/> `context.tool : ITool` - the tool that executed the command. <br/> `context.robot` - the robot. <br/> `context.res` - the response.<br/>`context.match` - the result of the regular expression matches.<br/>`context.values` - an object with named values. Correspond to the `parameter` values.
- `alias:Array<string>`: A list of aliases of the command. Can be used to support multiple names to trigger the command like: `["del", "rm"]`. An empty alias is also possible to add default commands to tools. Optional.
- `auth:Array<string>`: A list of usernames that will be used to authorize access to the command. Optional.
- `capture:string`: A regex that can be used to match values behind a command. Optional.
- `parameters:[IParameter]`: a list of named parameters. The value of each parameter is added to the `values` object of the invoke callback. Possible values: `StringParameter`, `NumberParameter`, `FractionParameter`, `RegExParameter` and `RestParameter`.

## Middleware

Some users will use software keyboards on Slack with auto prediction. Some
of those will insert an extra space after an auto predicted space. This will
cause many commands to fail - as regex mapping tends to be very strict.

To counter this problem we've created a some middleware that will remove
trailing whitespace characters from each message. It can be hooked up like
this:

```js
const {
  removeTrailingWhitespaceCharactersFromIncommingMessages,
  removeTrailingBotWhitespaceCharactersFromIncommingMessages,
} = require("hubot-command-mapper")

module.exports = robot => {
  removeTrailingWhitespaceCharactersFromIncommingMessages(robot)
  removeTrailingBotWhitespaceCharactersFromIncommingMessages(robot)
}
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
4. Contact <a href="https://twitter.com/KeesTalksTech">@KeesTalksTech</a> if we don't respond in time.

_Happy coding!_
