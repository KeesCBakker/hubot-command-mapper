export default function createHelpCommand(): {
    name: string;
    alias: string[];
    invoke: (tool: ITool, robot: IRobot, res: IResponse, match: RegExpMatchArray, helpMsgPrefix?: string, noHelpMsg?: string) => void;
};
