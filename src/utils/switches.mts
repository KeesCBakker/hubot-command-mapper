import { InternalRobot } from "../internals.mjs"

export function hasSwitch(robot: InternalRobot, name: string) {
  if (!robot.__switches) return false
  return robot.__switches.indexOf(name) != -1
}

export function setSwitch(robot: InternalRobot, name: string) {
  if (hasSwitch(robot, name)) return

  if (!robot.__switches) robot.__switches = []

  robot.__switches.push(name)
}
