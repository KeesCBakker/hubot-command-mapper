const defaultOptions: IOptions = {
    addDebugCommand: true,
    addHelpCommand: true,
    addReloadCommand: true,
    showInvalidSyntax: true,
    showHelpOnInvalidSyntax: true,
    invalidSyntaxMessage: "invalid syntax.",
    invalidSystaxHelpPrefix: "sorry, I don't understand. Maybe you could try: \n- ",
    notAuthorizedMessage: "sorry, you are not authorized to use this command.",
    verbose: true
};

Object.freeze(defaultOptions);

export default defaultOptions;