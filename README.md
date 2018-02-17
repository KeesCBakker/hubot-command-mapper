# hubot-command-mapper
Help with the creation of tools and command for hubot.

A _tool_ is a collection of _command_ objects that can be invoked. A convention is used to map the command into hubot. The direct question `@hubot clear screen` will launch the `screen` command of the `clear` tool.

## A simple example
Let's define the clear screen command by replying with 48 space-line replies.