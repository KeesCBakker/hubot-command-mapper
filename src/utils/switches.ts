import { IRobot } from "../definitions/IRobot"

export function hasSwitch(robot: Hubot.Robot, name: string) {
  let r = robot as IRobot
  if (!r.__switches) return false
  return r.__switches.indexOf(name) != -1
}

export function setSwitch(robot: Hubot.Robot, name: string) {
  if (hasSwitch(robot, name)) return

  let r = robot as IRobot
  if (!r.__switches) r.__switches = []
  r.__switches.push(name)
}
