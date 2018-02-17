import { EventDispatcher, IEvent } from "strongly-typed-events";
export default class MockedBot implements IRobot {
    name: string;
    alias: string;
    _replies: EventDispatcher<IRobot, string>;
    _listeners: {
        regex: RegExp;
        respond: (res: IResponse) => void;
    }[];
    constructor(name: string);
    readonly onReply: IEvent<IRobot, string>;
    helpCommands(): string[];
    loadFile(path: any, fileName: any): void;
    respond(regex: RegExp, onRespond: (res: IResponse) => void): void;
    receive(msg: string, userName: string, userId: string): void;
}
