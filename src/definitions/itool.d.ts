interface ITool
{
    name: string;
    auth?: Array<string>;
    mute?: boolean;
    registrations?: Array<{commandName: string, messageRegex: string}>;
    commands: Array<ICommand>;
}