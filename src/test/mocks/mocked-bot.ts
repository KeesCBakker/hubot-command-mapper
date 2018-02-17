import { EventDispatcher, IEvent } from "strongly-typed-events";

export default class MockedBot implements IRobot {
  alias = "";

  _replies = new EventDispatcher<IRobot, string>();
  _listeners = new Array<{
    regex: RegExp;
    respond: (res: IResponse) => void;
  }>();

  constructor(public name: string) {}

  get onReply() {
    return this._replies.asEvent();
  }

  helpCommands() {
    return new Array<string>();
  }

  loadFile(path, fileName) {}

  respond(regex: RegExp, onRespond: (res: IResponse) => void): void {
    this._listeners.push({
      regex: regex,
      respond: onRespond
    });
  }

  receive(msg: string, userName: string, userId: string) {
    let res: IResponse = {
      reply: msg => this._replies.dispatch(this, msg),
      message: {
        text: msg,
        user: {
          name: userName,
          id: userId
        }
      }
    };

    this._listeners.forEach(l => {
      if (l.regex.test(msg)) {
        l.respond(res);
      }
    });
  }
}

