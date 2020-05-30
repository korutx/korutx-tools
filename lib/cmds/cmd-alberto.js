exports.command = 'alb <command>'
exports.desc = 'interfaz de comando para operar con alberto'
exports.builder = yargs => yargs.commandDir('alb-cmds')
exports.handler = argv => {}