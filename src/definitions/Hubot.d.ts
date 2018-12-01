import { ITool } from "..";
import { IMutable } from "./IMutable";

// Type definitions for hubot 2.19
// Project: https://github.com/github/hubot
// Definitions by: Dirk Gadsden <https://github.com/dirk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare namespace Hubot {
  class Brain {
      userForId(id: any): any;
      userForName(name: string): any;
  }

  class User {
      id: any;
      name: string;
  }

  class Message {
      user: User;
      text: string;
      id: string;
  }

  class Response {
      match: RegExpMatchArray;
      message: Message;

      constructor(robot: Robot, message: Message, match: RegExpMatchArray);
      send(...strings: string[]): void;
      reply(...strings: string[]): void;
      emote(...strings: string[]): void;
      random<T>(items: T[]): T;
  }

  type ListenerCallback<R> = (response: Response) => void;

  type receiveMiddlewareCallback = (context: any, next: (done: any)=> void, done: any)=>void;

  class Robot {
      alias: string;
      brain: Brain;
      name: string;

      constructor(adapterPath: string, adapter: string, httpd: boolean, name: string, alias?: string);

      hear(regex: RegExp, callback: ListenerCallback<this>): void;
      hear(regex: RegExp, options: any, callback: ListenerCallback<this>): void;
      helpCommands(): Array<string>;
      loadFile(directory: string, fileName: string): void;                                       
      respond(regex: RegExp, callback: ListenerCallback<this>): void;
      respond(regex: RegExp, options: any, callback: ListenerCallback<this>): void;
      receiveMiddleware(receiveMiddlewareCallback): void;

      __tools? : IMutable[];
      __switches? : string[];
  }
}

// Compatibility with CommonJS syntax exported by Hubot's CoffeeScript.
// tslint:disable-next-line export-just-namespace
export = Hubot;
export as namespace Hubot;
