exports.command = 'config <command>'
exports.desc = 'Gestiona la configuracion de la herramienta'
exports.builder = yargs => yargs.commandDir('config-cmds')
exports.handler = argv => {}