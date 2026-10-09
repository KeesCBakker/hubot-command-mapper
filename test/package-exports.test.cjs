const assert = require("node:assert/strict")
const { test } = require("node:test")

test("package entrypoint supports require and import with the same exports", async () => {
  const commonjs = require("hubot-command-mapper")
  const esm = await import("hubot-command-mapper")

  assert.equal(typeof commonjs.map_tool, "function")
  assert.equal(commonjs.map_tool, esm.map_tool)
  assert.equal(commonjs.StringParameter, esm.StringParameter)
  assert.equal(new commonjs.StringParameter("name").name, "name")
})
