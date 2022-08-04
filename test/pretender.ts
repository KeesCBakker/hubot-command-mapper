/*
 * We've used Hubot Pretend in the past to test our command mapper
 * but that project is no longer maintained. We've copied the
 * this we've used into a Pretender class, so we can test if
 * our package still does what it needs to do. It is not ideal,
 * but it is the next best thing.
 * 
 */

export class Pretender {
  private _currentUser: string = ""
  private _robot: PretenderRobot;
  private _responders = new Array<PretenderRobotResponder>();
  private _recievers = new Array<PretenderRobotReiverMiddleware>();

  messages: string[][] = []

  constructor() {}

  start(
    options = {
      name: "hubot",
      alias: "",
    }
  ) {
    this.shutdown()
    this._robot = new PretenderRobot(this, options.name, options.alias);
  }

  user(name: string) {
    this._currentUser = name
    return this
  }

  shutdown() {
    this._currentUser = ""
    this.messages = []
    this._responders = []
  }

  send(msg: string) {

    this.messages.push([this._currentUser, msg])

    let message = new Message(msg, new User(this._currentUser));

    if (this._recievers.length > 0) {
      let i = 0;
      let shouldContinue = true;
      let receivers = this._recievers;

      function done() {
        shouldContinue = false;
      }

      function exec() {
        if (shouldContinue && i < receivers.length) {
          receivers[i].callback({
            response: {
              message
            }
          }, next, done);
        }
      }

      function next() {
        i++;
        exec();
      }

      exec();
    }


    let res = new PretenderRobotRes(this._robot, message, this._currentUser)
    for (let r of this._responders) {
      if (r.regex.test(message.text)) {

        r.callback(res)
        break
      }
    }

    return Promise.resolve<Pretender>(this)
  }
  
  sendMessageFromBot(msg: string) {
    this.messages.push([this.robot.name, msg])
  }

  registerResponder(regex: RegExp, callback: (res: PretenderRobotRes) => void) {
    this._responders.push({
      regex,
      callback
    });
  }

  registerReceiveMiddleware(callback: (context: Context, next: (done: () => void) => void, done: () => void) => void) {
    this._recievers.push({
      callback
    });
  }

  public get robot(): any {
    return this._robot;
  }
}

class PretenderRobot 
{
  constructor(public pretend: Pretender, public name: string, public alias: string) {
    
  }

  respond(regex: RegExp, callback: (res: PretenderRobotRes) => void) {
    this.pretend.registerResponder(regex, callback);    
  }

  receiveMiddleware(callback: (context: Context, next: (done: () => void) => void, done: () => void) => void) {
    this.pretend.registerReceiveMiddleware(callback);
  }

  helpCommands() {
    return []
  }

}

class PretenderRobotRes
{
  constructor(
    public robot: PretenderRobot,
    public message: Message,
    public toUser: string) { }

  reply(text: string) {
    this.robot.pretend.sendMessageFromBot("@" + this.toUser + " " + text);
  }

  emote(text: string) {
    this.robot.pretend.sendMessageFromBot(text);
  }
}


class Message {
  constructor(public text: string, public user: User) {
  }
}

class User {
  constructor(public name: string) {
    
  }
}

type PretenderRobotResponder = {
  regex: RegExp,
  callback: (res: PretenderRobotRes) => void
}

type PretenderRobotReiverMiddleware = {
  callback: (context: Context, next: (done: () => void) => void, done: () => void) => void
}

type Context = {
  response: {
    message: Message
  }
};