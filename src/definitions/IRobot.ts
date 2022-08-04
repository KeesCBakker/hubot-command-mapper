import { IMessageHandler } from "./IMessageHandler"

export type IRobot = {
    __tools?: IMessageHandler[]
    __switches?: string[]
}