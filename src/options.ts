const defaultOptions: IOptions = {
    addDebugCommand: true,
    addHelpCommand: true,
    addReloadCommand: true,
    showInvalidSyntax: true,
    showHelpOnInvalidSyntax: true,
    invalidSyntaxMessage: "invalid syntax.",
    invalidSystaxHelpPrefix: "sorry, I don't understand. Maybe you could try: \n- ",
    verbose: true
};

Object.freeze(defaultOptions);

export default defaultOptions;