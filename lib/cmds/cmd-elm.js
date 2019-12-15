exports.command = 'elm <command>'
exports.desc = 'Gestiona las tareas con el lenguaje elm'
exports.builder = yargs => yargs.commandDir('elm-cmds')
exports.handler = argv => {}