exports.command = 'bb <command>'
exports.desc = 'interfaz de comando para operar con bitbucket'
exports.builder = yargs => yargs.commandDir('bb-cmds')
exports.handler = argv => {}